import { ViewerTypes } from '../../constants/viewer-types';
import { ExtensionAnchors } from '../../constants/extension-types';
const { ExtensionAnchor } = window['extension-coordinator'];

export const ExtensionForTest = {
  authorName: 'test',
  id: 'id',
  description: 'description',
  iconUrl: 'icon_url',
  name: 'name',
  requestIdentity: false,
  sku: 'sku',
  state: 'state',
  summary: 'summary',
  token: 'token',
  vendorCode: 'vendorCode',
  version: '0.1',
  views: {
    panel: {
      viewerUrl: 'test'
    },
    config: {
      viewerUrl: 'test'
    },
    liveConfig: {
      viewerUrl: 'test',
    },
    component: {
      aspectHeight: 3000,
      aspectWidth: 2500,
      zoom: false,
      viewerUrl: 'test',
    }
  },
  whitelistedConfigUrls: ['foo'],
  whitelistedPanelUrls: ['bar'],
  channelId: 'channelId',
};

export function createViewsForTest(numOfViews, type, role, position) {
  let pos = {
    x: 0,
    y: 0
  }
  const extViews = [];
  if (position) {
    pos.x = position.x;
    pos.y = position.y;
  }

  for (let i = 0; i < numOfViews; i++) {
    extViews.push({
      id: (extViews.length + 1).toString(),
      type: type,
      extension: ExtensionForTest,
      linked: false,
      role: role,
      x: pos.x,
      y: pos.y,
    })
  }
  return extViews;
}
