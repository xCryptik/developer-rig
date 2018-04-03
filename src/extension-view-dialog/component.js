import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './component.sass';
import { ExtensionAnchors, DEFAULT_EXTENSION_TYPE } from '../constants/extension-types.js'
import { OverlaySizes, DEFAULT_OVERLAY_SIZE, DEFAULT_CUSTOM_DIMENSIONS } from '../constants/overlay_sizes.js'
import { ViewerTypes, DEFAULT_VIEWER_TYPE } from '../constants/viewer-types.js'
import { IdentityOptions, DEFAULT_IDENTITY_OPTION } from '../constants/identity-options';
import { ViewTypeImages } from '../constants/img-map';
import { RadioOption } from './radio-option';
import { DivOption } from './div-option';
import closeButton from '../img/close_icon.png';
export class ExtensionViewDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      extensionViewType: DEFAULT_EXTENSION_TYPE,
      overlaySize: DEFAULT_OVERLAY_SIZE,
      viewerType: DEFAULT_VIEWER_TYPE,
      width: DEFAULT_CUSTOM_DIMENSIONS.width,
      height: DEFAULT_CUSTOM_DIMENSIONS.height,
      identityOption: DEFAULT_IDENTITY_OPTION,
    }

    this.defaultState = this.state;
  }

  onChange = (input) => {
    const newState = {};
    newState[input.target.name] = input.target.value;
    this.setState(newState);
  }

  componentWillMount() {
    const allowedAnchors = this._getSupportedViews();
    if (allowedAnchors.length > 0) {
      this.setState({
        extensionViewType: allowedAnchors[0],
      });
    }
  }

  renderExtensionTypeComponents() {
    const allowedAnchors = this._getSupportedViews();
    const onlyOneOption = allowedAnchors.length === 1;
    return allowedAnchors.map(key => {
      return <DivOption
        key={key}
        img={ViewTypeImages[key]}
        name={ExtensionAnchors[key]}
        value={key}
        onChange={this.onChange}
        checked={(key === this.state.extensionViewType || onlyOneOption)} />
    });
  }

  renderOverlaySizeComponents() {
    return Object.keys(OverlaySizes).map(key => {
      return <RadioOption key={key} name="overlaySize" value={key} onChange={this.onChange} checked={key === DEFAULT_OVERLAY_SIZE}/>
    });
  }

  renderViewerTypeComponents() {
    return Object.keys(ViewerTypes).map(key => {
      return <RadioOption key={key} name="viewerType" value={ViewerTypes[key]} onChange={this.onChange} checked={key === DEFAULT_VIEWER_TYPE}/>
    });
  }

  renderIdentityOptionComponents() {
    return Object.keys(IdentityOptions).map(option => {
      return <RadioOption key={option} name="identityOption" value={option} onChange={this.onChange} checked={option === DEFAULT_IDENTITY_OPTION}/>
    });
  }

  close = () => {
    this.setState(this.defaultState);
    this.props.closeHandler();
  }

  save = () => {
    this.props.saveHandler();
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="new-extension-view">
        <div className="new-extension-view__background" />
        <div className="new-extension-view__dialog">
          <div className="dialog__top-bar-container">
            <div className="top-bar-container__title"> Add a new view </div>
            <div className="top-bar-container__escape" onClick={this.close}><img alt="Close" src={closeButton}/></div>
          </div>
          <hr className="dialog__divider" />
          <div className="dialog__type-and-size-container">
            <div className="type-and-size-container__type-title">
              Extension Type
              <div className="type-title__type-container">
                {this.renderExtensionTypeComponents()}
              </div>
            </div>
            <div className="type-and-size-container__size-title">
              Overlay Size
              <div className="size-title__size-subcontainer">
                <div className="size-subcontainer__presets">
                  {this.renderOverlaySizeComponents()}
                </div>
                <div className="size-subcontainer__custom-subcontainer">
                  <RadioOption name="overlaySize" value="Custom" onChange={this.onChange} checked={"Custom" === DEFAULT_IDENTITY_OPTION}/>
                  <div className="custom-subcontainer__inputs">
                    <div className="custom-subcontainer__input">
                      <label className="inputs__option-label inputs__width-offset"> Width </label>
                      <input type="text" name="width" onChange={this.onChange}/>
                    </div>
                    <div>
                      <label className="inputs__option-label"> Height </label>
                      <input type="text" name="height" onChange={this.onChange}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dialog__viewer-container">
            <div className="viewer-container__viewer-block">
            Viewer Type
            <div className="viewer-block__inputs">
              {this.renderViewerTypeComponents()}
            </div>
              {(this.state.viewerType === ViewerTypes.LoggedIn) ?
                this.renderIdentityOptionComponents() : null}
            </div>
          </div>
          <hr className="dialog__divider" />
          <div className="dialog_bottom-bar">
            <div className="bottom-bar__save" onClick={this.save}> Save </div>
            <div className="bottom-bar__cancel" onClick={this.close}> Cancel </div>
          </div>
        </div>
      </div>
    );
  }

  _getSupportedViews() {
    return Object.keys(ExtensionAnchors).filter(anchorS => {
      const anchorC = anchorS.replace(/_\w/g, (m) => m[1].toUpperCase());
      return this.props.extensionViews[anchorC];
    });
  }
}

ExtensionViewDialog.propTypes = {
  extensionViews: PropTypes.object.isRequired,
  closeHandler: PropTypes.func.isRequired,
  saveHandler: PropTypes.func.isRequired,
  show: PropTypes.bool,
};
