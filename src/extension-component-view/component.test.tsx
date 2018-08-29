import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { ExtensionComponentView } from './component';
import { ViewerTypes } from '../constants/viewer-types';
import { createExtensionForTest } from '../tests/constants/extension';

const setupShallow = setupShallowTest(ExtensionComponentView, () => ({
  id: '1',
  extension: createExtensionForTest(),
  frameSize: { width: 800, height: 600 },
  position: { x: 10, y: 10 },
  role: ViewerTypes.Broadcaster,
  bindIframeToParent: jest.fn(),
}));

describe('<ExtensionComponentView />', () => {
  it('renders correctly', () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when zoom is true', () => {
    const ext = {
      ...createExtensionForTest(),
      views: {
        component: {
          aspectWidth: 3000,
          aspectHeight: 2000,
          zoom: true,
        },
        config: {
          viewerUrl: 'test',
        },
        liveConfig: {
          viewerUrl: 'test',
        },
        panel: {
          viewerUrl: 'test',
          height: '300px'
        }
      },
    };

    const { wrapper } = setupShallow({
      extension: ext,
    });

    expect(wrapper).toMatchSnapshot();
  });
});
