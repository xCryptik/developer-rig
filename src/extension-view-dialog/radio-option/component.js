import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './component.sass';

export class RadioOption extends Component {
  render() {
    return (
      <div>
        <input type="radio" name={this.props.name} value={this.props.value}  onChange={this.props.onChange} defaultChecked={this.props.checked}/>
        <label className="option-label"> {this.props.value} </label>
      </div>
    )
  }
}

RadioOption.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool
}
