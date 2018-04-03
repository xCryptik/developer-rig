import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { ExtensionForTest, createViewsForTest } from '../tests/constants/extension';
import { ExtensionViewContainer } from './component';
const { ExtensionMode } = window['extension-coordinator'];

describe('<ExtensionViewContainer />', () => {
  const setupShallow = setupShallowTest(ExtensionViewContainer, () => ({
    mode: ExtensionMode.Viewer,
    extensionViews: createViewsForTest(0),
    deleteExtensionViewHandler: jest.fn(),
    openExtensionViewHandler: jest.fn(),
    extension: ExtensionForTest
  }));

  it('openExtensionViewHandler is called when the create button is clicked', () => {
    const { wrapper } = setupShallow();
    wrapper.find('ExtensionViewButton').simulate('click');
    expect(wrapper.instance().props.openExtensionViewHandler).toHaveBeenCalled();
   });

  describe('when in viewer mode', () => {
    it('renders correctly', () => {
      const { wrapper } = setupShallow();
      expect(wrapper).toMatchSnapshot();
    });
    it('has the correct number of views', () => {
      const { wrapper } = setupShallow({
        extensionViews: createViewsForTest(2)
      });
      expect(wrapper.find('ExtensionView')).toHaveLength(2);
    });
  });

  describe('when in broadcaster config mode', () => {
    it('renders correctly', () => {
      const { wrapper } = setupShallow({
        mode: ExtensionMode.Config
      });
      expect(wrapper).toMatchSnapshot();
    });
    it('has the correct number of views', () => {
      const { wrapper } = setupShallow({
        mode: ExtensionMode.Config
      });
      expect(wrapper.find('ExtensionView')).toHaveLength(1);
    });
  });

  describe('when in live config mode', () => {
    it('renders correctly', () => {
      const { wrapper } = setupShallow({
        mode: ExtensionMode.Dashboard
      });
      expect(wrapper).toMatchSnapshot();
    });
    it('has the correct number of views', () => {
      const { wrapper } = setupShallow({
        mode: ExtensionMode.Dashboard
      });
      expect(wrapper.find('ExtensionView')).toHaveLength(1);
    });
  });
});
