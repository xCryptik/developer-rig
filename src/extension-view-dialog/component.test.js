import React from 'react';
import { shallow } from 'enzyme';
import { ExtensionViewDialog } from './component';
import { DEFAULT_EXTENSION_TYPE } from '../constants/extension_types.js'
import { DEFAULT_OVERLAY_SIZE } from '../constants/overlay_sizes.js'
import { DEFAULT_VIEWER_TYPE } from '../constants/viewer_types.js'
const { ExtensionAnchor } = window['extension-coordinator'];

describe('<ExtensionViewDialog />', () => {
  describe('for an extension that supports video overlays and panels', () => {
    const views = {
      videoOverlay: true,
      panel: true,
    }
  
    const component = shallow(
      <ExtensionViewDialog
        extensionViews={views}
        closeHandler={jest.fn()}
        saveHandler={jest.fn()}
        show={true}
      />
    );
  
    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });
  
    it('has the correct default state', () => {
      expect(component.state('extensionViewType')).toBe(DEFAULT_EXTENSION_TYPE);
      expect(component.state('overlaySize')).toBe(DEFAULT_OVERLAY_SIZE);
      expect(component.state('viewerType')).toBe(DEFAULT_VIEWER_TYPE);
    });

    it('has the correct selected UI elements', () => {
      expect(component.find('DivOption[value="video_overlay"][checked=true]')).toHaveLength(1);
      expect(component.find('DivOption[checked=false]')).toHaveLength(1);

      expect(component.find('RadioOption[value="640x480"][checked=true]')).toHaveLength(1);
      expect(component.find('RadioOption[name="overlaySize"][checked=false]')).toHaveLength(4);

      expect(component.find('RadioOption[value="Broadcaster"][checked=true]')).toHaveLength(1);
      expect(component.find('RadioOption[name="viewerType"][checked=false]')).toHaveLength(2);

      expect(component.find('RadioOption[name="identityOption"]')).toHaveLength(0);
    });
  });

  describe('for an extension that only supports panels', () => {
    const views = {
      panel: true,
    }
  
    const component = shallow(
      <ExtensionViewDialog
        extensionViews={views}
        closeHandler={jest.fn()}
        saveHandler={jest.fn()}
        show={true}
      />
    );
  
    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });

    it('has the correct default state', () => {
      expect(component.state('extensionViewType')).toBe('panel');
      expect(component.state('overlaySize')).toBe(DEFAULT_OVERLAY_SIZE);
      expect(component.state('viewerType')).toBe(DEFAULT_VIEWER_TYPE);
    });

    it('has the correct selected UI elements', () => {
      expect(component.find('DivOption[value="panel"][checked=true]')).toHaveLength(1);
      expect(component.find('DivOption[checked=false]')).toHaveLength(0);

      expect(component.find('RadioOption[value="640x480"][checked=true]')).toHaveLength(1);
      expect(component.find('RadioOption[name="overlaySize"][checked=false]')).toHaveLength(4);

      expect(component.find('RadioOption[value="Broadcaster"][checked=true]')).toHaveLength(1);
      expect(component.find('RadioOption[name="viewerType"][checked=false]')).toHaveLength(2);

      expect(component.find('RadioOption[name="identityOption"]')).toHaveLength(0);
    });
  });
});
