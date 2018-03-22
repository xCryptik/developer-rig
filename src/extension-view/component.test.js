import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { ExtensionView } from './component';
import { ViewerTypes } from '../constants/viewer-types';
import { ExtensionForTest } from '../tests/constants/extension';
const { ExtensionAnchor } = window['extension-coordinator'];

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
