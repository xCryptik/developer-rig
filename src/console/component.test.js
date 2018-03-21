import React from 'react';
import { shallow } from 'enzyme';
import { ExtensionRigConsole } from './component';

describe('<ExtensionRigConsole />', () => {
  const component = shallow(
    <ExtensionRigConsole />
  );

  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });

  it('renders log messages correctly', () => {
    expect(component.find('ExtensionRigConsoleLog').exists()).toEqual(false);
    component.setState({
      logHistory: [
        {
          log: 'test',
          frame: 'test-frame',
        },
      ],
    });
    component.update();
    expect(component.find('ExtensionRigConsoleLog').exists()).toEqual(true);
  });
});
