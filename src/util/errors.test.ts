import { missingConfigurations } from './errors';

let globalAny = global as any;

describe('errors', () => {
  describe('missingConfigurations ', () => {
    it('should return correct data', async function() {
      const actual = missingConfigurations({
        EXT_CLIENT_ID: '',
        EXT_SECRET: 'secret',
        EXT_VERSION: '',
      });
      const expected = 'Missing configurations for rig: EXT_CLIENT_ID,EXT_VERSION';
      expect(actual).toEqual(expected);
    });
  });
});
