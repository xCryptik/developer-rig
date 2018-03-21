import React from 'react';
import { shallow } from 'enzyme';
import { RigNav } from './component';
import { EXTENSION_VIEWS } from '../constants/nav-items';

describe('<RigNav />', () => {
  describe('receives an error', () => {
    const error = "RigNav Error";
    const component = shallow(
      <RigNav 
        error={error}/>
    );
  
    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });

    it('has the correct prop', () => {
      expect(component.instance().props.error).toEqual(error);
    });
  });

  describe('starts up successfully', () => {
    let usage = 0;
    const error = '';
    const func = () => {
      usage++;
    }
    const component = shallow(
      <RigNav
        openConfigurationsHandler={func}
        viewHandler={func}
        configHandler={func}
        liveConfigHandler={func}
        selectedView={EXTENSION_VIEWS}
      />
    );

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });

    it('has the correct props', () => {
      expect(component.instance().props.selectedView).toEqual(EXTENSION_VIEWS);
      expect(component.instance().props.viewHandler).toEqual(func);
      expect(component.instance().props.openConfigurationsHandler).toEqual(func);
      expect(component.instance().props.configHandler).toEqual(func);
      expect(component.instance().props.liveConfigHandler).toEqual(func);
    });
    
    it('handles clicks properly', () => {
      //TODO: implement
    });
  })
});
