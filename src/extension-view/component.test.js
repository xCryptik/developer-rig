import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { ExtensionView } from './component';
import { ViewerTypes } from '../constants/viewer-types';
import { ExtensionForTest } from '../tests/constants/extension';
const { ExtensionAnchor } = window['extension-coordinator'];

const DeleteButtonSelector = '.view__close_button';

describe('<ExtensionView />', () => {
  const setupShallow = setupShallowTest(ExtensionView, () => ({
    id: '0',
    extension: ExtensionForTest,
    type: ExtensionAnchor.Panel,
    role: ViewerTypes.Broadcaster,
    mode: 'viewer',
    linked: false,
    deleteViewHandler: jest.fn()
  }));

  it('when moused over displays the delete button', () => {
    const { wrapper } = setupShallow();
    wrapper.simulate('mouseEnter');
    expect(wrapper.state().mousedOver).toBe(true);
    expect(wrapper.find(DeleteButtonSelector)).toHaveLength(1);
  });

  it('when moused over and mouse leaves, no delete button displayed', () => {
    const { wrapper } = setupShallow();
    wrapper.simulate('mouseEnter');
    expect(wrapper.state().mousedOver).toBe(true);
    expect(wrapper.find(DeleteButtonSelector)).toHaveLength(1);
    wrapper.simulate('mouseLeave')
    expect(wrapper.state().mousedOver).toBe(false);
    expect(wrapper.find(DeleteButtonSelector)).toHaveLength(0);
  });

  it('when moused over and delete button is clicked, the deleteViewHandler is clicked', () => {
    const { wrapper } = setupShallow();
    wrapper.simulate('mouseEnter');
    expect(wrapper.state().mousedOver).toBe(true);
    expect(wrapper.find(DeleteButtonSelector)).toHaveLength(1);
    wrapper.find(DeleteButtonSelector).simulate('click');
    expect(wrapper.instance().props.deleteViewHandler).toHaveBeenCalled();
  });

  describe('panel mode views', () => {
    it('renders correctly when in panel mode as a Broadcaster', () => {
      const { wrapper } = setupShallow();
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly when in panel mode as a Logged In and Unlinked Viewer', () => {
      const { wrapper } = setupShallow({
        role: ViewerTypes.LoggedIn,
        linked: false,
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly when in panel mode as a Logged In and Linked Viewer', () => {
      const { wrapper } = setupShallow({
        role: ViewerTypes.LoggedIn,
        linked: true,
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly when in panel mode as a Logged Out', () => {
      const { wrapper } = setupShallow({
        role: ViewerTypes.LoggedOut,
      });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('overlay mode views', () => {
    it('renders correctly in overlay mode as a Broadcaster', () => {
      const { wrapper } = setupShallow({
        type: ExtensionAnchor.Overlay,
        overlaySize: {
          height: "1px",
          width: "1px"
        }
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly when in overlay mode as a Logged In and Unlinked Viewer', () => {
      const { wrapper } = setupShallow({
        role: ViewerTypes.LoggedIn,
        linked: false,
        overlaySize: {
          height: "1px",
          width: "1px"
        }
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly when in overlay mode as a Logged In and Linked Viewer', () => {
      const { wrapper } = setupShallow({
        role: ViewerTypes.LoggedIn,
        linked: true,
        overlaySize: {
          height: "1px",
          width: "1px"
        }
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly when in overlay mode as a Logged Out', () => {
      const { wrapper } = setupShallow({
        role: ViewerTypes.LoggedOut,
        overlaySize: {
          height: "1px",
            width: "1px"
          }
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
