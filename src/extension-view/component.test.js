import React from 'react';
import { shallow } from 'enzyme';
import { ExtensionView } from './component';

describe('<ExtensionView />', () => {
  const extension = {
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
    version: 'version',
    views: {},
    whitelistedConfigUrls: 'foo',
    whitelistedPanelUrls: 'bar',
    channelId: 'channelId',
  };
  const iframeClassName = 'rig-frame frameid-0';

  describe('when a panel type', () => {
    const panelType = 'panel';
    const role = 'Broadcaster';
    const mode = 'viewer';
    const linked = false;
    const component = shallow(
      <ExtensionView
        id={'0'}
        extension={extension}
        type={panelType}
        mode={mode}
        role={role}
        linked={linked}
        deleteViewHandler={() => { }}/>
    );

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });
  });


  describe('when a panel type', () => {
    const panelType = 'video_overlay';
    const role = 'Broadcaster';
    const mode = 'viewer';
    const linked = false;
    const component = shallow(
      <ExtensionView
        id={'0'}
        extension={extension}
        type={panelType}
        mode={mode}
        role={role}
        linked={linked}
        overlaySize={{
          width: '1px',
          height: '1px',
        }}
        deleteViewHandler={() => { }}/>
    );

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });
  });
});
