import { createExtensionObject } from './extension';
import { ViewerTypes } from '../constants/viewer-types';
import { createToken } from './token';
import { ExtensionManifest } from '../core/models/manifest';

describe('extension', () => {
  const manifest: ExtensionManifest = {
    author_name: 'test',
    bits_enabled: true,
    description: 'test',
    icon_urls: {
      '100x100': 'test',
    },
    id: 'test',
    name: 'test',
    request_identity_link: false,
    sku: 'test',
    state: 'test',
    summary: 'test',
    vendor_code: 'test',
    version: '0.0.1',
    views: {
      panel: {
        can_link_external_content: false,
        height: 300,
        viewer_url: 'test'
      },
      config: {
        can_link_external_content: false,
        viewer_url: 'test'
      },
      live_config: {
        can_link_external_content: false,
        viewer_url: 'test',
      },
      component: {
        aspect_height: 3000,
        aspect_width: 2500,
        can_link_external_content: false,
        viewer_url: 'test',
        size: 1024,
        zoom: false,
        zoom_pixels: 24,
      }
    },
    whitelisted_config_urls: [],
    whitelisted_panel_urls: [],
  };

  const index = '0';
  const role = ViewerTypes.LoggedOut;
  const isLinked = false;
  const ownerID = 'test';
  const channelId = 'test';
  const secret = 'test';
  const opaqueId = 'testOpaqueId';

  it('creates an extension with the correct data', () => {
    const expected = {
      authorName: manifest.author_name,
      bitsEnabled: manifest.bits_enabled,
      clientId: manifest.id,
      description: manifest.description,
      iconUrl: manifest.icon_urls["100x100"],
      id: manifest.id + ':' + index,
      name: manifest.name,
      requestIdentityLink: manifest.request_identity_link,
      sku: manifest.sku,
      state: manifest.state,
      summary: manifest.summary,
      token: createToken(role, isLinked, ownerID, channelId, secret, opaqueId),
      vendorCode: manifest.vendor_code,
      version: manifest.version,
      views: {
        panel: {
          canLinkExternalContent: false,
          height: 300,
          viewerUrl: 'test'
        },
        config: {
          canLinkExternalContent: false,
          viewerUrl: 'test'
        },
        liveConfig: {
          canLinkExternalContent: false,
          viewerUrl: 'test',
        },
        component: {
          aspectHeight: 3000,
          aspectWidth: 2500,
          canLinkExternalContent: false,
          viewerUrl: 'test',
          zoom: false,
          zoomPixels: 24,
        }
      },
      whitelistedConfigUrls: manifest.whitelisted_config_urls,
      whitelistedPanelUrls: manifest.whitelisted_panel_urls,
    };

    const result = createExtensionObject(manifest, index, role, isLinked, ownerID, channelId, secret, opaqueId);
    expect(result).toEqual(expected);
  });
});
