import { store } from '../core/rig';
import { getUserSession } from '../core/state/session';

const DEFAULT_API_VERSION = 5;
const API_HOST = process.env.API_HOST || 'api.twitch.tv';
const CLIENT_ID = process.env.EXT_CLIENT_ID;
export const CONTENT_TYPE = 'Content-Type';
export const CONTENT_TYPE_JSON = 'application/json; charset=UTF-8';
export const CONTENT_TYPE_JSON_PREFIX = 'application/json';

export interface APIOptions {
  version?: number;
}

interface Headers {
  [id: string]: string;
}

export interface TwitchAPIError {
  error: string;
  status: number;
  message: string;
}

export interface TwitchAPIResponse {
  status: number;
  error?: TwitchAPIError;
  requestError?: Error;
}

export interface OptionalTwitchAPIResponse<T> extends TwitchAPIResponse {
  body?: T;
}

export interface GuaranteedTwitchAPIResponse<T> extends TwitchAPIResponse {
  body: T;
}

/**
 * This interface acts as a modification of the RequestInit type:
 *
 * - headers: stricter so that we can merge default headers in with custom defined ones here.
 * - body: RequestInit doesn't allow a bespoke Object passed to fetch anymore, but we want our API to take an object.
 *   This can be a FormData, a pre-serialized string, or an Object (which will get serialized into a JSON string).
 */
export interface Options extends Omit<RequestInit, 'body'> {
  headers?: Headers;
  body?: FormData | string | Object;
}

export interface GETOptions extends Options {
  method?: 'GET';
}

export interface POSTOptions extends Options {
  method?: 'POST';
}

export class TwitchAPI {
  /**
   * GET:
   *
   * This request will not reject its promise when a response comes back with a non-2xx status,
   * or with a malformed request object. Use response.error or response.requestError after resolving
   * instead to capture errors.
   */
  public static async get<T>(path: string, options: GETOptions = {}, apiOptions: APIOptions = {}): Promise<OptionalTwitchAPIResponse<T>> {
    return await this.request<T>(path, {
      ...options,
      method: 'GET',
    }, apiOptions);
  }

  /**
   * GET:
   *
   * This request will reject its promise when a response comes back with a non-2xx status,
   * or with a malformed request object. Make sure you catch this rejection.
   */
  public static async getOrThrow<T = null>(path: string, options: GETOptions = {}, apiOptions: APIOptions = {}): Promise<GuaranteedTwitchAPIResponse<T>> {
    return await this.requestOrThrow<T>(path, {
      ...options,
      method: 'GET',
    }, apiOptions);
  }

  /**
   * POST:
   *
   * This request will not reject its promise when a response comes back with a non-2xx status,
   * or with a malformed request object. Use response.error or response.requestError after resolving
   * instead to capture errors.
   */
  public static async post<T = {}>(path: string, options: POSTOptions = {}, apiOptions: APIOptions = {}): Promise<OptionalTwitchAPIResponse<T>> {
    return await this.request<T>(path, {
      ...options,
      method: 'POST',
    }, apiOptions);
  }

  /**
   * POST:
   *
   * This request will reject its promise when a response comes back with a non-2xx status,
   * or with a malformed request object. Make sure you catch this rejection.
   */
  public static async postOrThrow<T = null>(path: string, options: POSTOptions = {}, apiOptions: APIOptions = {}): Promise<GuaranteedTwitchAPIResponse<T>> {
    return await this.requestOrThrow<T>(path, {
      ...options,
      method: 'POST',
    }, apiOptions);
  }

  public static async request<T>(path: string, options: Options = {}, apiOptions: APIOptions = {}): Promise<OptionalTwitchAPIResponse<T>> {
    options = this.constructOptions(options, apiOptions);
    const contentType = options.headers ? options.headers[CONTENT_TYPE] : undefined;

    // Transform Options.body to something fetch can handle
    const body = this.serialize(options.body, contentType);
    const fetchOptions: RequestInit = { ...options, body, referrer: 'Twitch Developer Rig' };

    const res: Response = await this._fetch(path, fetchOptions);
    return await this.constructTwitchAPIResponse<T>(res);
  }

  public static async requestOrThrow<T = null>(path: string, options: Options = {}, apiOptions: APIOptions = {}): Promise<GuaranteedTwitchAPIResponse<T>> {
    try {
      const response = await this.request<T>(path, options, apiOptions);

      // Re-throw exceptions from the underlying fetch request
      if (response.requestError) {
        throw response.requestError;
      }

      // Compose a useful error to throw if visage returned with an actual error message
      if (response.error) {
        throw new Error(`Error while sending twitch-api request: ${response.error.status} - ${response.error.message}`);
      }

      const guaranteedResponse: GuaranteedTwitchAPIResponse<T> = {
        ...response,
        body: response.body as T,
      };

      return guaranteedResponse;
    } catch (err) {
      throw err;
    }
  }

  public static getAPIURL(path: string): URL {
    return new URL(path, `https://${API_HOST}`);
  }

  private static async constructTwitchAPIResponse<T extends {}>(res: Response): Promise<OptionalTwitchAPIResponse<T>> {
    const TwitchAPIResponse: OptionalTwitchAPIResponse<T> = {
      status: res.status,
    };

    try {
      const body = await res.json();

      if (res.ok) {
        TwitchAPIResponse.body = body as T;
      } else {
        TwitchAPIResponse.error = body as TwitchAPIError;
      }
    } catch (err) {
      // failure to parse json should only be an error if content type is also json
      // At this point there are already many tests that don't mock headers
      // therefore this code ensures headers exist before verifying content type
      // and checking content type only on failures
      if (res.headers && res.headers.get) {
        const contentType = res.headers.get(CONTENT_TYPE);
        if (contentType && contentType.indexOf(CONTENT_TYPE_JSON_PREFIX) !== -1) {
          TwitchAPIResponse.requestError = err;
        }
      }
    }

    return TwitchAPIResponse;
  }

  private static async _fetch(path: string, options: RequestInit = {}): Promise<Response> {
    return await fetch(this.getAPIURL(path).toString(), options);
  }

  private static constructOptions<T extends Options>(options: T, apiOptions: APIOptions): T {
    // TypeScript does not allow spreading a generic, hence the usage of `assign`.
    options = Object.assign({}, options, {
      headers: {
        ...this.getDefaultHeaders(options, apiOptions),
        ...options.headers,
      },
    });

    return options;
  }

  /**
   * This transforms an object into one that fetch's RequestInit can handle
   * as a body field. This limits the serialized output to null, FormData,
   * a pre-serialized string, or a JSON string.
   */
  private static serialize(body?: FormData | Object, contentType?: string): FormData | string | null {
    if (contentType === CONTENT_TYPE_JSON) {
      return JSON.stringify(body);
    } else if (typeof body === 'string') {
      return body;
    } else if (body && FormData.prototype.isPrototypeOf(body)) {
      return body as FormData;
    } else if (!body) {
      return null;
    } else {
      console.log(
        new Error('Could not serialize this request body for the content-type provided.'),
        'attempting to serialize object with a non-JSON content-type',
        { contentType },
      );
      return null;
    }
  }

  private static getDefaultHeaders(options: Options, apiOptions: APIOptions): Headers {
    const state = store.getState();

    const headers: Headers = {
      'Accept': `application/vnd.twitchtv.v${apiOptions.version || DEFAULT_API_VERSION}+json; charset=UTF-8`,
      'Accept-Language': 'en-us',
      'Client-ID': CLIENT_ID!,
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (!options.body || !FormData.prototype.isPrototypeOf(options.body)) {
      headers[CONTENT_TYPE] = CONTENT_TYPE_JSON;
    }

    const user = getUserSession(state);

    if (user) {
      headers.Authorization = `OAuth ${user.authToken}`;
    }

    return headers;
  }
}
