import React from 'react';
import { shallow } from 'enzyme';
import { ExtensionViewContainer } from './component';

describe('<ExtensionViewContainer />', () => {
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
  }
  
  describe('when in non-Viewer mode', () => {
    const fakeHandler = () => {};
    const component = shallow(
      <ExtensionViewContainer 
        mode={'config'}
        extensionViews={[]}
        deleteExtensionViewHandler={fakeHandler}
        openExtensionViewHandler={fakeHandler} 
        extension={extension}/>
    );

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });

    it('has only 1 view', () => {
      expect(component.find('ExtensionView').exists()).toEqual(true);
    });
  });
});
