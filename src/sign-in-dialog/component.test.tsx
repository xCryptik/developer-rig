import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { SignInDialog } from './component';

describe('<SignInDialog />', () => {
  const setupShallow = setupShallowTest(SignInDialog, () => ({}));

  it('renders correctly', () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });
});
