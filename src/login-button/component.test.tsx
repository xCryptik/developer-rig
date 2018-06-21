import { setupShallowTestWithStore, setupShallowTest } from '../tests/enzyme-util/shallow';
import { LoginButton } from './component';
import { EXTENSION_VIEWS, BROADCASTER_CONFIG, LIVE_CONFIG, CONFIGURATIONS  } from '../constants/nav-items';

describe('<LoginButton />', () => {
  const defaultGenerator = () => ({});
  const setupRenderer = setupShallowTest(LoginButton, defaultGenerator);

  it('renders correctly', () => {
    const { wrapper } = setupRenderer();
    expect(wrapper).toMatchSnapshot();
  });
});
