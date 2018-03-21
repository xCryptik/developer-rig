import React from 'react';
import { shallow } from 'enzyme';
import { ExtensionFrame } from './component';

describe('<ExtensionFrame />', () => {
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

  describe('when in live config mode', () => {
    const frameType = 'liveConfig';
    const frameMode = 'dashboard';
    const component = shallow(
      <ExtensionFrame
        iframeClassName={iframeClassName}
        extension={extension}
        type={frameType}
        mode={frameMode}/>
    );

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });

    it('has the correct props', () => {
      const props = component.instance().props;
      expect(props.iframeClassName).toBe(iframeClassName);
      expect(props.type).toBe(frameType);
      expect(props.mode).toBe(frameMode);
      expect(props.extension).toBe(extension);
    });
  });

  describe('when in config mode', () => {
    const frameType = 'config';
    const frameMode = 'config';
    const component = shallow(
      <ExtensionFrame
        iframeClassName={iframeClassName}
        extension={extension}
        type={frameType}
        mode={frameMode}/>
    );

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });

    it('has the correct props', () => {
      const props = component.instance().props;
      expect(props.iframeClassName).toBe(iframeClassName);
      expect(props.type).toBe(frameType);
      expect(props.mode).toBe(frameMode);
      expect(props.extension).toBe(extension);
    });
  });

  describe('when in live config mode', () => {
    const frameType = 'panel';
    const frameMode = 'viewer';
    const component = shallow(
      <ExtensionFrame
        iframeClassName={iframeClassName}
        extension={extension}
        type={frameType}
        mode={frameMode}/>
    );

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });

    it('has the correct props', () => {
      const props = component.instance().props;
      expect(props.iframeClassName).toBe(iframeClassName);
      expect(props.type).toBe(frameType);
      expect(props.mode).toBe(frameMode);
      expect(props.extension).toBe(extension);
    });
  });
});
