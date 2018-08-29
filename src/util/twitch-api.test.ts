import * as FetchMock from 'fetch-mock';
import { TwitchAPI } from './twitch-api';

describe('TwitchAPI', () => {
  describe('.get()', () => {
    it('returns the parsed body upon success', async () => {
      const testPath = '/get/body';
      const testURL = TwitchAPI.getAPIURL(testPath).toString();
      const responseBody = { success: 'yes' };

      FetchMock.getOnce(testURL, { body: responseBody });

      const apiResponse = await TwitchAPI.get(testPath);
      expect(apiResponse.body).toEqual(responseBody);
    });

    it('does not throw when the response is a non-200', async () => {
      const testPath = '/get/body/throw';
      const testURL = TwitchAPI.getAPIURL(testPath).toString();
      const responseBody = { success: 'no' };

      FetchMock.getOnce(testURL, { body: responseBody, status: 404 });

      let response;
      try {
        response = await TwitchAPI.get(testPath);
      } catch {}

      expect(response.status).toEqual(404);
    });
  });

  describe('.getOrThrow()', () => {
    it('returns the response object upon success', async () => {
      const testPath = '/getOrThrow/body';
      const testURL = TwitchAPI.getAPIURL(testPath).toString();
      const responseBody = { success: 'yes' };

      FetchMock.getOnce(testURL, { body: responseBody });

      const apiResponse = await TwitchAPI.getOrThrow(testPath);
      expect(apiResponse.body).toEqual(responseBody);
    });

    it('throws when response is a non-200', async () => {
      expect.assertions(1);
      const testPath = '/getOrThrow/body/throw';
      const testURL = TwitchAPI.getAPIURL(testPath).toString();
      const responseBody = { success: 'no' };

      FetchMock.getOnce(testURL, { body: responseBody, status: 404 });

      try {
        await TwitchAPI.getOrThrow(testPath);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe('.post()', () => {
    it('returns the parsed body upon success', async () => {
      const testPath = '/post/body';
      const testURL = TwitchAPI.getAPIURL(testPath).toString();
      const responseBody = { success: 'yes' };

      FetchMock.postOnce(testURL, { body: responseBody });

      const apiResponse = await TwitchAPI.post(testPath);
      expect(apiResponse.body).toEqual(responseBody);
    });

    it('does not throw when the response is a non-200', async () => {
      const testPath = '/post/body/throw';
      const testURL = TwitchAPI.getAPIURL(testPath).toString();
      const responseBody = { success: 'no' };

      FetchMock.postOnce(testURL, { body: responseBody, status: 404 });

      let response;
      try {
        response = await TwitchAPI.post(testPath);
      } catch {}

      expect(response.status).toEqual(404);
    });
  });

  describe('.postOrThrow()', () => {
    it('returns the response object upon success', async () => {
      const testPath = '/postOrThrow/body';
      const testURL = TwitchAPI.getAPIURL(testPath).toString();
      const responseBody = { success: 'yes' };

      FetchMock.postOnce(testURL, { body: responseBody });

      const apiResponse = await TwitchAPI.postOrThrow(testPath);
      expect(apiResponse.body).toEqual(responseBody);
    });

    it('throws when response is a non-200', async () => {
      expect.assertions(1);
      const testPath = '/postOrThrow/body/throw';
      const testURL = TwitchAPI.getAPIURL(testPath).toString();
      const responseBody = { success: 'no' };

      FetchMock.postOnce(testURL, { body: responseBody, status: 404 });

      try {
        await TwitchAPI.postOrThrow(testPath);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe('.request()', () => {
    it('serializes the request', () => {
      const testPath = '/request/json';
      const testURL = TwitchAPI.getAPIURL(testPath).toString();
      const mockAPI = FetchMock.mock(testURL, 200);

      TwitchAPI.request(testPath, {
        method: 'POST',
        body: { serialized: 'body' },
      });

      expect((mockAPI.lastOptions(testURL) as RequestInit).body).toEqual('{"serialized":"body"}')

      TwitchAPI.request(testPath, {
        method: 'GET',
      });

      expect((mockAPI.calls(testURL) as RequestInit[])).toMatchObject([
        [testURL, { method: 'POST' }],
        [testURL, { method: 'GET' }],
      ]);
    });
  });

  describe('.requestOrThrow()', () => {
    it('serializes the request', () => {
      const testPath = '/requestOrThrow/json';
      const testURL = TwitchAPI.getAPIURL(testPath).toString();
      const mockAPI = FetchMock.mock(testURL, 200);

      TwitchAPI.requestOrThrow(testPath, {
        method: 'POST',
        body: { serialized: 'body' },
      });

      expect((mockAPI.lastOptions(testURL) as RequestInit).body).toEqual('{"serialized":"body"}')

      TwitchAPI.requestOrThrow(testPath, {
        method: 'GET',
      });

      expect((mockAPI.calls(testURL) as RequestInit[])).toMatchObject([
        [testURL, { method: 'POST' }],
        [testURL, { method: 'GET' }],
      ]);
    });

    it('throws on error', async () => {
      const testPath = '/error/response';
      const testURL = TwitchAPI.getAPIURL(testPath).toString();
      const errorMessage = 'oops';

      FetchMock.getOnce(testURL, { status: 401, body: { error: errorMessage } });

      try {
        await TwitchAPI.requestOrThrow(testPath);
        fail('error is present but the TwitchAPI did not throw');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    })
  });

  describe('#getAPIURL', () => {
    it('returns a valid URL for a "/" prefixed path', () => {
      const url = TwitchAPI.getAPIURL('/foo');
      expect(url.toString()).toEqual(`https://api.twitch.tv/foo`);
    });

    it('returns a valid URL for a non "/" prefixed path', () => {
      const url = TwitchAPI.getAPIURL('foo');
      expect(url.toString()).toEqual(`https://api.twitch.tv/foo`);
    });
  });
});
