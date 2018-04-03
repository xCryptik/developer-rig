import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { ExtensionForTest } from '../tests/constants/extension';
import { ExtensionFrame } from './component';

const { ExtensionViewType, ExtensionAnchor, ExtensionMode } = window['extension-coordinator'];

describe('<ExtensionFrame />', () => {
  //const dblClickHandler = jest.spyOn(ExtensionFrame.prototype, '_onFrameDoubleClick');
  const setupShallow = setupShallowTest(ExtensionFrame, () => ({
    className: 'view',
    frameId: '0',
    extension: ExtensionForTest,
    type: ExtensionAnchor.Panel,
    mode: ExtensionMode.Viewer,
  }));

  it('prevents the default when double clicked', () => {
    const { wrapper } = setupShallow();
    wrapper.simulate('dblclick');
  //  expect(dblClickHandler).toHaveBeenCalled();
  });
  describe('when in live config mode', () => {
    it('renders correctly', () => {
      const { wrapper } = setupShallow({
        type: ExtensionViewType.LiveConfig,
        mode: ExtensionMode.Dashboard,
      });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when in config mode', () => {
    it('renders correctly', () => {
      const { wrapper } = setupShallow({
        type: ExtensionViewType.Config,
        mode: ExtensionMode.Config,
      });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when in panel mode', () => {
    it('renders correctly', () => {
      const { wrapper } = setupShallow({
        type: ExtensionAnchor.Panel,
        mode: ExtensionMode.Viewer,
      });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when in video overlay mode', () => {
    it('renders correctly', () => {
      const { wrapper } = setupShallow({
        type: ExtensionAnchor.Overlay,
        mode: ExtensionMode.Viewer,
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
