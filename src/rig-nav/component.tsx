import * as React from 'react';
import { EXTENSION_VIEWS, BROADCASTER_CONFIG, LIVE_CONFIG, CONFIGURATIONS } from '../constants/nav-items';
import { UserDropdown } from '../user-dropdown';
import { LoginButton } from '../login-button';
import { UserSession } from '../core/models/user-session';
import './component.sass';
import { ExtensionManifest } from '../core/models/manifest';

export interface PublicProps {
  openConfigurationsHandler: Function,
  viewerHandler: Function,
  loginHandler: Function,
  configHandler: Function,
  liveConfigHandler: Function,
  selectedView: string,
  error: string,
}

export interface ReduxStateProps {
  session?: UserSession,
  manifest?: ExtensionManifest,
}
type Props = PublicProps & ReduxStateProps;

export class RigNavComponent extends React.Component<Props> {
  private openConfigurationsHandler = (): void => {
    this.props.openConfigurationsHandler();
  }

  public render() {
    const { session, manifest } = this.props;
    if (this.props.error !== '') {
      return (
        <div className='top-nav-error'>
          <a> {this.props.error} </a>
        </div>
      );
    } else {
      return (
        <div className='top-nav'>
          <div className='personal-bar'>
            {manifest && <div className='personal-bar__ext-name'>
              <span>{manifest.name}</span>
            </div>}
            <div className='top-nav-item__login'>
              {(session && session.login) ? <UserDropdown session={this.props.session} /> : <LoginButton/>}
            </div>
          </div>
          <div className='top-nab__item-container'>
            <a
              className={this.props.selectedView === EXTENSION_VIEWS ? 'top-nav-item top-nav-item__selected offset' : 'top-nav-item offset'}
              onClick={(event) => this.props.viewerHandler()}>Extension Views</a>
            <a
              className={this.props.selectedView === BROADCASTER_CONFIG ? 'top-nav-item top-nav-item__selected' : 'top-nav-item'}
              onClick={(event) => this.props.configHandler()}>Broadcaster Config</a>
            <a
              className={this.props.selectedView === LIVE_CONFIG ? 'top-nav-item top-nav-item__selected' : 'top-nav-item'}
              onClick={(event) => this.props.liveConfigHandler()}>Live Config</a>
            <a
              className={this.props.selectedView === CONFIGURATIONS ? 'top-nav-item top-nav-item__selected' : 'top-nav-item'}
              onClick={(event) => this.openConfigurationsHandler()}>Configurations</a>
          </div>
        </div>
      );
    }
  }
}
