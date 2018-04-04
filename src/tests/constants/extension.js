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
    }
  },
  whitelistedConfigUrls: ['foo'],
  whitelistedPanelUrls: ['bar'],
  channelId: 'channelId',
};

export function createViewsForTest(numOfViews) {
  const extViews = [];
  for (let i = 0; i < numOfViews; i++) {
    extViews.push({
      id: (extViews.length + 1).toString(),
      type: ExtensionAnchors[ExtensionAnchor.Panel],
      extension: ExtensionForTest,
      linked: false,
      role: ViewerTypes.LoggedOut,
    })
  }
  return extViews;
}
