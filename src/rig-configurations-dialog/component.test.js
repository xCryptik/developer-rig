import React from 'react';
import { shallow } from 'enzyme';
import { RigConfigurationsDialog } from './component';

describe('<RigConfigurationsDialog />', () => {
  describe('should not be shown', () => {
    const func = () => {};
    const component = shallow(
      <RigConfigurationsDialog
        config={{}}
        closeConfigurationsHandler={func}
        refreshConfigurationsHandler={func}
        show={false}/>
    );
  
    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });

    it('should be null', () => {
      expect(component.type()).toEqual(null);
    });
  });

  describe('should have JSON configurations', () => {
    const func = () => {};
    const config = {'test': 'config'};
    const component = shallow (
      <RigConfigurationsDialog
        config={config}
        closeConfigurationsHandler={func}
        refreshConfigurationsHandler={func}
        show={false}/>
    );

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });
  });
});
