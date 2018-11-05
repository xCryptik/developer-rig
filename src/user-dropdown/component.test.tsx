import { setupMountTest } from '../tests/enzyme-util/mount';
import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { UserDropdownComponent } from './component';
import { LocalStorageKeys } from '../constants/rig';

function mockApiFunctions() {
  return {
    ...require.requireActual('../util/api'),
    fetchNewRelease: jest.fn(),
  };
}
jest.mock('../util/api', () => mockApiFunctions());
const api = require.requireMock('../util/api');

describe('<UserDropdownComponent />', () => {
  const defaultGenerator = () => ({
    session: {
      authToken: 'test',
      displayName: 'test',
      id: 'test',
      login: 'test',
      profileImageUrl: 'test.png',
    },
    logout: jest.fn(),
  });
  const setupRenderer = setupShallowTest(UserDropdownComponent, defaultGenerator);
  const setupMount = setupMountTest(UserDropdownComponent, defaultGenerator);

  it('renders correctly', () => {
    const { wrapper } = setupRenderer();
    expect(wrapper).toMatchSnapshot();
  });

  it('does not render if session null', () => {
    const { wrapper } = setupRenderer({
      session: null,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when clicked', () => {
    const { wrapper } = setupRenderer();
    wrapper.simulate('click');
    expect(wrapper.find('.user-dropdown__menu.open')).toHaveLength(1);
    wrapper.simulate('click');
    expect(wrapper.find('.open')).toHaveLength(0);
  });

  it('signs out', () => {
    const { wrapper } = setupRenderer();
    wrapper.find('li').last().simulate('click');
    expect(localStorage.getItem(LocalStorageKeys.RigLogin)).toEqual(null);
    expect(wrapper.instance().props.logout).toHaveBeenCalledTimes(1);
  });

  it('wants new release', () => {
    const tagName = '1', zipUrl = 'zipUrl';
    process.env.GIT_RELEASE = '0';
    api.fetchNewRelease = jest.fn().mockImplementation(() => Promise.resolve({ tagName, zipUrl }));
    const { wrapper } = setupMount();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          expect(api.fetchNewRelease).toHaveBeenCalled();
          expect(wrapper.state().showingNewRelease).toBe(true);
          expect(wrapper.state().releaseUrl).toBe(zipUrl);
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });
});
