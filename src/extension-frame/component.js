import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './component.sass';
const { ExtensionPlatform } = window['extension-coordinator'];

export const EXT_FRAME_WRAPPER_CLASS = 'extension-frame-wrapper';

export class ExtensionFrame extends Component {
  constructor() {
    super(...arguments);

    this._boundOnFrameDoubleClick = this._onFrameDoubleClick.bind(this);
    this._boundOnIdentityLinked = this._onIdentityLinked.bind(this);
    this._boundOnModalRequested = this._onModalRequested.bind(this);
    this._boundIframeHostRefHandler = this._iframeHostRefHandler.bind(this);

  }

  componentDidMount() {
    const { ExtensionFrame } = window['extension-coordinator'];
    this.extensionFrame = new ExtensionFrame({
      anchor: this.props.type,
      channelId: this.props.extension.channelId,
      loginId: null,
      dobbin: {
        trackEvent: (eventName, properties, services) => { },
      },
      extension: this.props.extension,
      iframeClassName: this.props.iframeClassName,
      mode: this.props.mode,
      platform: ExtensionPlatform.Web,
      parentElement: this.parentElement,
      trackingProperties: {},
    });

    if (this.parentElement) {
      this.parentElement.addEventListener('dblclick', this._boundOnFrameDoubleClick);
    }
    this.extensionFrame.on('identityLinked', this._boundOnIdentityLinked);
    this.extensionFrame.on('requestModal', this._boundOnModalRequested);
  }

  render() {
    return (
      <div
        ref={this._boundIframeHostRefHandler}
        className={EXT_FRAME_WRAPPER_CLASS}
      />
    );
  }

    _onIdentityLinked(isLinked) {
      const { extension, onIdentityLinked } = this.props;
      if (!onIdentityLinked) {
          return;
      }

      onIdentityLinked(extension.id, isLinked);
  }

  _onFrameDoubleClick(evt) {
    evt.preventDefault();
  }

  _onModalRequested(confirmationRequest) {
      this.props.onModalRequested(confirmationRequest);
  }

  _iframeHostRefHandler(element) {
    this.parentElement = element;
  }
}

ExtensionFrame.propTypes = {
  iframeClassName: PropTypes.string.isRequired,
  extension: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
};
