import React, { Component } from 'react';
import { RigNav } from '../rig-nav';
import { ExtensionViewContainer } from '../extension-view-container';
import { ExtensionRigConsole } from '../console';
import { ExtensionViewDialog } from '../extension-view-dialog';
import { RigConfigurationsDialog } from '../rig-configurations-dialog';
import { createExtensionObject } from '../util/extension';
import { createSignedToken } from '../util/token';
import { fetchManifest, fetchExtensionManifest } from '../util/api';
import { EXTENSION_VIEWS, BROADCASTER_CONFIG, LIVE_CONFIG, CONFIGURATIONS } from '../constants/nav-items'
import { ViewerTypes } from '../constants/viewer-types';
import { OverlaySizes } from '../constants/overlay_sizes';
import { IdentityOptions } from '../constants/identity-options';
import { RIG_ROLE } from '../constants/rig';
const { ExtensionMode } = window['extension-coordinator'];

export class Rig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: process.env.EXT_CLIENT_ID,
      secret: process.env.EXT_SECRET,
      version: process.env.EXT_VERSION,
      channelId: process.env.EXT_CHANNEL_ID,
      userName: process.env.EXT_USER_NAME,
      mode: ExtensionMode.Viewer,
      extensionViews: [],
      manifest: {},
      showExtensionsView: false,
      showConfigurations: false,
      selectedView: EXTENSION_VIEWS,
      extension: {},
      userId: '',
      error: '',
    };
    this._boundDeleteExtensionView = this._deleteExtensionView.bind(this);
  }

  componentDidMount() {
    this._fetchInitialConfiguration();
  }

  componentWillMount() {
    this._initLocalStorage();
  }

  openConfigurationsHandler = () => {
    this.setState({
      showConfigurations: true,
      selectedView: CONFIGURATIONS
    });
  }

  closeConfigurationsHandler = () => {
    this.setState({
      showConfigurations: false,
    });
  }

  viewerHandler = () => {
    this.setState({
      mode: ExtensionMode.Viewer,
      selectedView: EXTENSION_VIEWS,
      extension: {},
    });
  }

  configHandler = () => {
    this.setState({
      mode: ExtensionMode.Config,
      selectedView: BROADCASTER_CONFIG,
      extension: createExtensionObject(
        this.state.manifest,
        0,
        ViewerTypes.Broadcaster,
        '',
        this.state.userName,
        this.state.channelId,
        this.state.secret),
    });
  }

  liveConfigHandler = () => {
    this.setState({
      mode: ExtensionMode.Dashboard,
      selectedView: LIVE_CONFIG,
      extension: createExtensionObject(
        this.state.manifest,
        0,
        ViewerTypes.Broadcaster,
        '',
        this.state.userName,
        this.state.channelId,
        this.state.secret),
    });
  }

  openExtensionViewHandler = () => {
    if (this.state.error === '') {
      this.setState({
        showExtensionsView: true,
      });
    }
  }

  closeExtensionViewDialog = () => {
    this.setState({
      showExtensionsView: false
    });
  }

  refreshConfigurationsHandler = () => {
    const token = createSignedToken(RIG_ROLE, '', this.state.userId, this.state.channelId, this.state.secret);
    fetchExtensionManifest('api.twitch.tv', this.state.clientId, this.state.version, token, this._onConfigurationSuccess, this._onConfigurationError);
  }

  _onConfigurationSuccess = (data) => {
    this.setState(data);
  }

  _onConfigurationError = (errMsg) => {
    this.setState({
      error: errMsg,
    });
  }

  createExtensionView = () => {
    const extensionViews = this._getExtensionViews();
    const linked = this.refs.extensionViewDialog.state.identityOption === IdentityOptions.Linked;
    extensionViews.push({
      id: (extensionViews.length + 1).toString(),
      type: this.refs.extensionViewDialog.state.extensionViewType,
      extension: createExtensionObject(
        this.state.manifest,
        (extensionViews.length + 1).toString(),
        this.refs.extensionViewDialog.state.viewerType,
        linked,
        this.state.userName,
        this.state.channelId,
        this.state.secret
      ),
      linked: linked,
      role: this.refs.extensionViewDialog.state.viewerType,
      overlaySize: OverlaySizes[this.refs.extensionViewDialog.state.overlaySize],
    });
    this._pushExtensionViews(extensionViews);
    this.closeExtensionViewDialog();
  }

  render() {
    return (
      <div>
        <RigNav
          ref="rigNav"
          selectedView={this.state.selectedView}
          viewerHandler={this.viewerHandler}
          configHandler={this.configHandler}
          liveConfigHandler={this.liveConfigHandler}
          openConfigurationsHandler={this.openConfigurationsHandler}
          error={this.state.error}/>
        <ExtensionViewContainer
          ref="extensionViewContainer"
          mode={this.state.mode}
          extensionViews={this.state.extensionViews}
          deleteExtensionViewHandler={this._boundDeleteExtensionView}
          openExtensionViewHandler={this.openExtensionViewHandler}
          extension={this.state.extension} />
        {this.state.showExtensionsView &&
          <ExtensionViewDialog
            ref="extensionViewDialog"
            extensionType={this.state.manifest.anchor}
            show={this.state.showExtensionsView}
            closeHandler={this.closeExtensionViewDialog}
            saveHandler={this.createExtensionView} />}
        <RigConfigurationsDialog
          show={this.state.showConfigurations}
          config={this.state.manifest}
          closeConfigurationsHandler={this.closeConfigurationsHandler}
          refreshConfigurationsHandler={this.refreshConfigurationsHandler} />
        <ExtensionRigConsole />
      </div>
    );
  }

  _getExtensionViews() {
    const extensionViewsValue = localStorage.getItem("extensionViews");
    return extensionViewsValue ? JSON.parse(extensionViewsValue) : extensionViewsValue;
  }

  _pushExtensionViews(newViews) {
    localStorage.setItem("extensionViews", JSON.stringify(newViews));
    this.setState({
      extensionViews: newViews,
    });
  }

  _deleteExtensionView(id) {
    this._pushExtensionViews(this.state.extensionViews.filter(element => element.id !== id));
  }

  _fetchInitialConfiguration() {
    fetchManifest("api.twitch.tv", this.state.clientId, this.state.userName, this.state.version, this.state.channelId, this.state.secret, this._onConfigurationSuccess, this._onConfigurationError);
  }

  _initLocalStorage() {
    const extensionViewsValue = localStorage.getItem("extensionViews");
    if (!extensionViewsValue) {
      localStorage.setItem("extensionViews", JSON.stringify([]));
    }
    this.setState({
      extensionViews: JSON.parse(extensionViewsValue)
    })
  }
}
