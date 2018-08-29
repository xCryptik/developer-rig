import { MobileOrientation } from '../../constants/mobile';
import { ExtensionManifest } from '../../core/models/manifest';
import { RigExtensionView } from '../../core/models/rig';

export const createExtensionManifestForTest = (): ExtensionManifest => ({
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
});

export const createExtensionForTest = (): ExtensionCoordinator.ExtensionObject => ({
  authorName: 'test',
  clientId: 'mockClientId',
  bitsEnabled: false,
  description: 'description',
  iconUrl: 'icon_url',
  id: 'id',
  name: 'name',
  requestIdentityLink: false,
  sku: 'sku',
  summary: 'summary',
  token: 'token',
  vendorCode: 'vendorCode',
  version: '0.1',
  state: 'Released' as ExtensionCoordinator.ExtensionState,
  views: {
    config: {
      canLinkExternalContent: false,
      viewerUrl: 'test',
    },
    component: {
      aspectHeight: 3000,
      aspectWidth: 2500,
      canLinkExternalContent: false,
      viewerUrl: 'test',
      zoom: false,
      zoomPixels: 100,
    },
    liveConfig: {
      canLinkExternalContent: false,
      viewerUrl: 'test',
    },
    mobile: {
      viewerUrl: 'test',
    },
    panel: {
      canLinkExternalContent: false,
      height: 300,
      viewerUrl: 'test',
    },
    videoOverlay: {
      canLinkExternalContent: false,
      viewerUrl: 'test',
    },
  },
  whitelistedConfigUrls: ['foo'],
  whitelistedPanelUrls: ['bar'],
});

export function createViewsForTest(numOfViews: number, type: string, role: string, extras?: any): Partial<RigExtensionView>[] {
  let ex = {
    x: 0,
    y: 0,
    orientation: MobileOrientation.Portrait,
  }
  const extViews = [];
  if (extras) {
    ex.x = extras.x;
    ex.y = extras.y;
  }

  for (let i = 0; i < numOfViews; i++) {
    extViews.push({
      id: (extViews.length + 1).toString(),
      type: type,
      mode: 'viewer',
      extension: createExtensionForTest(),
      linked: false,
      role: role,
      x: ex.x,
      y: ex.y,
      orientation: ex.orientation,
    })
  }

  return extViews;
}
