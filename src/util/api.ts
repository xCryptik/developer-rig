import { Product, DeserializedProduct } from '../core/models/product';
import { createSignedToken } from './token';
import { missingConfigurations } from './errors';
import { RigRole } from '../constants/rig';
import { TwitchAPI } from './twitch-api';
import { ExtensionManifest } from '../core/models/manifest';

interface ExtensionsSearchResponse {
  extensions: ExtensionManifest[];
}

export async function fetchExtensionManifest(id: string, version: string, jwt: string) {
  const { body } = await TwitchAPI.postOrThrow<ExtensionsSearchResponse>('/extensions/search', {
    body: {
      limit: 1,
      searches: [
        { field: 'id', term: id },
        { field: 'version', term: version }
      ]
    },
    headers: {
      Authorization: `Bearer ${jwt}`,
    }
  });

  if (body.extensions && body.extensions.length > 0) {
    const manifest = body.extensions[0];
    return Promise.resolve({ manifest });
  }

  return Promise.reject('Unable to retrieve extension manifest, please verify EXT_OWNER_NAME and EXT_SECRET');
}

interface UsersResponse {
  data: {
    broadcaster_type: string;
    description: string;
    display_name: string;
    id: string;
    login: string;
    offline_image_url: string;
    profile_image_url: string;
    type: string;
    view_count: number;
  }[];
}

export async function fetchManifest(host: string, clientId: string, username: string, version: string, channelId: string, secret: string) {
  if (!username || !clientId || !version || !channelId || !secret) {
    return Promise.reject(missingConfigurations({
      'EXT_CLIENT_ID': clientId,
      'EXT_VERSION': version,
      'EXT_CHANNEL': channelId,
      'EXT_SECRET': secret,
    }));
  }

  const response  = await TwitchAPI.get<UsersResponse>(`/helix/users?login=${username}`);
  if (response.status >= 400 && response.status < 500) {
    return Promise.reject(`Unable to authorize for user ${username} and client id ${clientId}`)
  }

  if (response.status >= 500) {
    return Promise.reject('Unable to hit Twitch API to initialize the rig. Try again later.');
  }

  const { data } = response.body;
  const token = createSignedToken(RigRole, '', data[0].id, channelId, secret);
  return fetchExtensionManifest(clientId, version, token);
}

export async function fetchUserInfo(accessToken: string) {
  const response = await TwitchAPI.getOrThrow<UsersResponse>('/helix/users', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });

  const { data } = response.body;
  if (!data && data.length === 0) {
    return Promise.reject(`Unable to get user data for token: ${accessToken}`);
  }

  return Promise.resolve(data[0]);
}

export function fetchProducts(host: string, clientId: string, token: string) {
  const api = 'https://' + host + '/v5/bits/extensions/twitch.ext.' + clientId + '/products?includeAll=true';

  return fetch(api, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      Authorization: `OAuth ${token}`,
      'Content-Type': 'application/json',
      'Client-ID': clientId,
    },
    referrer: 'Twitch Developer Rig',
  }).then(response => response.json())
    .then(respJson => {
      if (respJson.error) {
        return Promise.reject(respJson.message);
      }

      const products = respJson.products;
      if (!products) {
        return Promise.reject('Unable to get products for clientId: ' + clientId);
      }

      const serializedProducts = products.map((p: DeserializedProduct) => {
        let product = {
          sku: p.sku || '',
          displayName: p.displayName || '',
          amount: p.cost ? p.cost.amount.toString() : '1',
          inDevelopment: p.inDevelopment ? 'true' : 'false',
          broadcast: p.broadcast ? 'true' : 'false',
          deprecated: p.expiration ? Date.parse(p.expiration) <= Date.now() : false,
        };

        return product;
      });

      return Promise.resolve(serializedProducts);
    });
}

export function saveProduct(host: string, clientId: string, token: string, product: Product, index: number) {
  const api = 'https://' + host + '/v5/bits/extensions/twitch.ext.' + clientId + '/products/put';
  const deserializedProduct = {
    domain: 'twitch.ext.' + clientId,
    sku: product.sku,
    displayName: product.displayName,
    cost: {
      amount: product.amount,
      type: 'bits'
    },
    inDevelopment: product.inDevelopment === 'true' ? true : false,
    broadcast: product.broadcast === 'true' ? true : false,
    expiration: product.deprecated ? new Date(Date.now()).toISOString() : null
  };

  return fetch(api, {
    method: 'POST',
    body: JSON.stringify({ product: deserializedProduct }),
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      Authorization: `OAuth ${token}`,
      'Content-Type': 'application/json',
      'Client-ID': clientId,
    },
    referrer: 'Twitch Developer Rig',
  }).then(response => response.json())
    .then(() => index)
    .catch((error) => ({ index, error }));
}

export function fetchNewRelease() {
  const api = 'https://api.github.com/repos/twitchdev/developer-rig/releases/latest';
  return fetch(api, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.v3+json',
    }
  }).then(response => response.json())
    .then(respJson => {
      const tagName = respJson.tag_name;
      const zipUrl = respJson.assets[0].browser_download_url;
      if (tagName && zipUrl) {
        return Promise.resolve({
          tagName,
          zipUrl
        });
      }

      return Promise.reject(new Error('Cannot get GitHub developer rig latest release'));
    });
}
