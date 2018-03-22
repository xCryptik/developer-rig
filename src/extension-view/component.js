import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './component.sass';
import { ExtensionFrame } from '../extension-frame';
import { IdentityOptions } from '../constants/identity-options';
import { ViewerTypes } from '../constants/viewer_types';
import closeButton from '../img/close_icon.png';
const { ExtensionAnchor, ExtensionMode } = window['extension-coordinator'];

export class ExtensionView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mousedOver: false,
    };
  }

  mouseEnter() {
    this.setState({
      mousedOver: true,
    });
  }

  mouseLeave() {
    this.setState({
      mousedOver: false
    });
  }

  renderLinkedOrUnlinked() {
    return this.props.linked ? IdentityOptions.Linked : IdentityOptions.Unlinked;
  }

  render() {
    const extensionProps = {}
    switch(this.props.type) {
      case ExtensionAnchor.Panel:
        extensionProps.viewStyles = {
          width: "320px",
        };
        break;
      case ExtensionAnchor.Overlay:
        extensionProps.viewStyles = {
          width: this.props.overlaySize.width,
          height: this.props.overlaySize.height
        };
        break;
      case ExtensionMode.Config:
        extensionProps.viewStyles = {
          width: "100%",
          height: "700px"
        };
        extensionProps.viewWrapperStyles = {
          overflow: "auto",
          height: "70vh",
        };
        break;
      default:
        break;
    }

    return (

      <div
        className={'view__wrapper'}
        onMouseEnter={() => { this.mouseEnter() }}
        onMouseLeave={() => { this.mouseLeave() }}
        style={extensionProps.viewWrapperStyles}>
        <div
          className={'view__header'}>
          {(this.props.deleteViewHandler !== undefined && this.state.mousedOver) &&
            (<div className={'view__close_button'}
              onClick={() => { this.props.deleteViewHandler(this.props.id) }}>
            <img
              alt='Close'
              src={closeButton}
            />
            </div>)
          }
          <div className={'view__descriptor'}>
            { this.props.role }
          </div>
          <div className={'view__descriptor'}>
            {(this.props.role === ViewerTypes.LoggedIn) ?
              this.renderLinkedOrUnlinked() : null}
          </div>
        </div>
        <div
          className="view"
          ref={this._boundIframeHostRefHandler}
          style={extensionProps.viewStyles}>
          <ExtensionFrame
            iframeClassName={`rig-frame frameid-${this.props.id}`}
            extension={this.props.extension}
            type={this.props.type}
            mode={this.props.mode}
          />
        </div>
      </div>
    );
  }
}

ExtensionView.propTypes = {
  id: PropTypes.string.isRequired,
  extension: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  role: PropTypes.string,
  overlaySize: PropTypes.object,
};
