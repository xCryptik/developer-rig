import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './component.sass'

export class ExtensionViewButton extends Component {
  render() {
    return (
      <div className="circle-button" onClick={this.props.onClick}>
        <p>+</p>
      </div>
    )
  }
}

ExtensionViewButton.propTypes = {
  onClick: PropTypes.func.isRequired
}
