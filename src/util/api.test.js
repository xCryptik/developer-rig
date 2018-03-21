import { fetchExtensionManifest } from './api';

describe('api', () => {
  beforeEach(function() {
    global.fetch = jest.fn().mockImplementation(() => {
      var p = new Promise((resolve, reject) => {
        resolve({
          ok: true, 
          json: function() { 
            return {
              extensions: [
                {
                  version: 1,
                  id: "clientid",
                  views: {}
                }
              ]
            }
          }
        });
      });

      return p;
    });
  });

  describe('fetchExtensionManifest', () => {
    it('should return data', async function() {
      await fetchExtensionManifest("127.0.0.1:8080", "clientId", "version", "jwt", (data) => {
        expect(data).toBeDefined();
      });
    });
  })
});
