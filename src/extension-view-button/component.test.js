import React from 'react';
import { shallow } from 'enzyme';
import { ExtensionViewButton } from './component';

describe('<ExtensionViewButton />', () => {
  let hasBeenClicked = false;
  const func = () => {
    hasBeenClicked = true;
  }
  const component = shallow(
  <ExtensionViewButton
    onClick={func} />
  );
  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
