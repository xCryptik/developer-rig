import { Product } from '../core/models/product';
import {
  fetchExtensionManifest,
  fetchUserInfo,
  fetchProducts,
  fetchNewRelease
} from './api';
import {
  mockFetchError,
  mockFetchForExtensionManifest,
  mockFetchForUserInfo,
  mockFetchProducts,
  mockFetchNewRelease
} from '../tests/mocks';

let globalAny = global as any;

describe('api', () => {
  describe('fetchExtensionManifest', () => {
    beforeEach(function() {
      globalAny.fetch = jest.fn().mockImplementation(mockFetchForExtensionManifest);
    });

    it('should return data', async function() {
      const data = await fetchExtensionManifest('clientId', 'version', 'jwt');
      expect(data).toBeDefined();
    });
  });

  describe('fetchUserInfo', () => {
    beforeEach(() => {
      globalAny.fetch = jest.fn().mockImplementation(mockFetchForUserInfo);
    });

    it('should return data', async function() {
      const data = await fetchUserInfo('token');
      expect(data).toBeDefined();
    });

    it('on error should fire', async function() {
      expect.assertions(1);

      globalAny.fetch = jest.fn().mockImplementation(mockFetchError);
      try {
        await fetchUserInfo('token');
      } catch (error) {
        expect(error).toEqual('Fake error');
      }
    });
  });

  describe('fetchProducts', () => {
    beforeEach(function() {
      globalAny.fetch = jest.fn().mockImplementation(mockFetchProducts);
    });

    it('should return products', async function() {
      const products = await fetchProducts('127.0.0.1:8080', 'clientId', '');
      expect(products).toBeDefined();
    });

    it('should serialize products correctly', async function() {
      const products = await fetchProducts('127.0.0.1:8080', 'clientId', '')
      expect(products).toHaveLength(2);
      products.forEach((product: Product) => {
        expect(product).toMatchObject({
          sku: expect.any(String),
          displayName: expect.any(String),
          amount: expect.stringMatching(/[1-9]\d*/),
          inDevelopment: expect.stringMatching(/true|false/),
          broadcast: expect.stringMatching(/true|false/)
        });
      });
    });
  });

  describe('fetchNewRelease', () => {
    let includeTagName: boolean;

    beforeEach(function() {
      globalAny.fetch = jest.fn().mockImplementation(() => mockFetchNewRelease(includeTagName));
    });

    it('should return data', async function() {
      includeTagName = true;
      const data = await fetchNewRelease();
      expect(data).toBeDefined();
    });

    it('fails without tag name', async function() {
      includeTagName = false;
      fetchNewRelease().catch((error) => {
        expect(error.message).toEqual('Cannot get GitHub developer rig latest release');
      })
    });

    it('on error should fire', async function() {
      expect.assertions(1);

      globalAny.fetch = jest.fn().mockImplementation(mockFetchError);
      fetchNewRelease().catch((error) => {
        expect(error).toEqual('Fake error');
      });
    });
  });
});
