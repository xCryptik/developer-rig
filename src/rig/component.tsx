import * as React from 'react';
import './component.sass';
import { RigNav } from '../rig-nav';
import { ExtensionViewContainer } from '../extension-view-container';
import { Console } from '../console';
import { ExtensionViewDialog, ExtensionViewDialogState } from '../extension-view-dialog';
import { RigConfigurationsDialog } from '../rig-configurations-dialog';
import { EditViewDialog, EditViewProps } from '../edit-view-dialog';
import { ProductManagementViewContainer } from '../product-management-container';
import { fetchExtensionManifest, fetchUser } from '../util/api';
import { NavItem } from '../constants/nav-items'
import { OverlaySizes } from '../constants/overlay-sizes';
import { IdentityOptions } from '../constants/identity-options';
import { MobileSizes } from '../constants/mobile';
import { RigExtensionView } from '../core/models/rig';
import { ExtensionManifest } from '../core/models/manifest';
import { UserSession } from '../core/models/user-session';
import { SignInDialog } from '../sign-in-dialog';
import { ExtensionMode, ExtensionViewType } from '../constants/extension-coordinator';
import { TokenSpec, createSignedToken } from '../util/token';
import { RigRole } from '../constants/rig';

enum LocalStorageKeys {
  RigExtensionViews = 'extensionViews',
  RigLogin = 'rigLogin',
}

export interface ReduxStateProps {
  session: UserSession;
}

export interface ReduxDispatchProps {
  saveManifest: (manifest: ExtensionManifest) => void;
  userLogin: (userSession: UserSession) => void;
}

interface State {
  apiHost: string;
  clientId: string;
  secret: string;
  version: string;
  extensionViews: RigExtensionView[],
  manifest?: ExtensionManifest;
  showingExtensionsView: boolean;
  showingConfigurations: boolean;
  showingEditView: boolean;
  idToEdit: string;
  selectedView: NavItem;
  userId?: string;
  error?: string;
}

type Props = ReduxDispatchProps & ReduxStateProps;

export class RigComponent extends React.Component<Props, State> {
  public state: State = {
    apiHost: process.env.API_HOST || 'api.twitch.tv',
    clientId: process.env.EXT_CLIENT_ID,
    secret: process.env.EXT_SECRET,
    version: process.env.EXT_VERSION,
    extensionViews: [],
    showingExtensionsView: false,
    showingConfigurations: false,
    showingEditView: false,
    idToEdit: '0',
    selectedView: NavItem.ExtensionViews,
  }

  constructor(props: Props) {
    super(props);
    this.setLogin();
  }

  public componentDidMount() {
    this.initLocalStorage();
    this.fetchInitialConfiguration();
  }

  public openConfigurationsHandler = () => {
    this.setState({
      showingConfigurations: true,
    });
  }

  public closeConfigurationsHandler = () => {
    this.setState({
      showingConfigurations: false,
    });
  }

  public openEditViewHandler = (id: string) => {
    this.setState({
      showingEditView: true,
      idToEdit: id,
    });
  }

  public closeEditViewHandler = () => {
    this.setState({
      showingEditView: false,
      idToEdit: '0',
    });
  }

  public viewerHandler = () => {
    this.setState({ selectedView: NavItem.ExtensionViews });
  }

  private openProductManagementHandler = () => {
    this.setState({ selectedView: NavItem.ProductManagement });
  }

  public openExtensionViewHandler = () => {
    if (!this.state.error) {
      this.setState({
        showingExtensionsView: true,
      });
    }
  }

  public closeExtensionViewDialog = () => {
    this.setState({
      showingExtensionsView: false
    });
  }

  public onConfigurationSuccess = (manifest: ExtensionManifest) => {
    this.props.saveManifest(manifest);
    this.setState({ manifest });
  }

  public onConfigurationError = (error: Error) => {
    const emptyVariables = [];
    this.state.clientId.trim() || emptyVariables.push('EXT_CLIENT_ID');
    this.state.secret.trim() || emptyVariables.push('EXT_SECRET');
    this.state.version.trim() || emptyVariables.push('EXT_VERSION');
    const message = emptyVariables.length ? 'set ' + emptyVariables.join(', ') :
      'verify EXT_CLIENT_ID, EXT_SECRET, and EXT_VERSION.';
    this.setState({ error: `${error.message}  Please ${message}` });
  }

  public getFrameSizeFromDialog(extensionViewDialogState: ExtensionViewDialogState) {
    if (extensionViewDialogState.frameSize === 'Custom') {
      return {
        width: extensionViewDialogState.width,
        height: extensionViewDialogState.height
      };
    }
    if (extensionViewDialogState.extensionViewType === ExtensionViewType.Mobile) {
      return MobileSizes[extensionViewDialogState.frameSize];
    }

    return OverlaySizes[extensionViewDialogState.frameSize];
  }

  public createExtensionView = (extensionViewDialogState: ExtensionViewDialogState) => {
    const extensionViews = this.getStoredRigExtensionViews();
    const mode = extensionViewDialogState.extensionViewType === ExtensionMode.Config ? ExtensionMode.Config :
      extensionViewDialogState.extensionViewType === ExtensionMode.Dashboard ? ExtensionMode.Dashboard : ExtensionMode.Viewer;
    const linked = extensionViewDialogState.identityOption === IdentityOptions.Linked ||
      extensionViewDialogState.extensionViewType === ExtensionMode.Config ||
      extensionViewDialogState.extensionViewType === ExtensionMode.Dashboard;
    const nextExtensionViewId = 1 + extensionViews.reduce((reduced: number, view: RigExtensionView) => {
      return Math.max(reduced, parseInt(view.id, 10));
    }, 0);
    extensionViews.push({
      id: nextExtensionViewId.toString(),
      channelId: extensionViewDialogState.channelId,
      type: extensionViewDialogState.extensionViewType,
      features: {
        isChatEnabled: extensionViewDialogState.isChatEnabled,
      },
      linked,
      linkedUserId: extensionViewDialogState.linkedUserId,
      opaqueId: extensionViewDialogState.opaqueId,
      mode,
      isPopout: extensionViewDialogState.isPopout,
      role: extensionViewDialogState.viewerType,
      x: extensionViewDialogState.x,
      y: extensionViewDialogState.y,
      orientation: extensionViewDialogState.orientation,
      frameSize: this.getFrameSizeFromDialog(extensionViewDialogState),
    });
    this.pushExtensionViews(extensionViews);
    this.closeExtensionViewDialog();
  }

  public deleteExtensionView = (id: string) => {
    this.pushExtensionViews(this.state.extensionViews.filter(element => element.id !== id));
  }

  public editViewHandler = (newViewState: EditViewProps) => {
    const views = this.getStoredRigExtensionViews();
    views.forEach((element: RigExtensionView) => {
      if (element.id === this.state.idToEdit) {
        element.x = newViewState.x;
        element.y = newViewState.y;
        element.orientation = newViewState.orientation;
      }
    });
    this.pushExtensionViews(views);
    this.closeEditViewHandler();
  }

  public render() {
    return (
      <div className="rig-container">
        <RigNav
          selectedView={this.state.selectedView}
          viewerHandler={this.viewerHandler}
          openConfigurationsHandler={this.openConfigurationsHandler}
          openProductManagementHandler={this.openProductManagementHandler}
          error={this.state.error} />
        {this.state.error ? (
          <label>Something went wrong: {this.state.error}</label>
        ) : !this.props.session ? (
          <SignInDialog />
        ) : this.state.selectedView === NavItem.ProductManagement ? (
          <ProductManagementViewContainer clientId={this.state.clientId} />
        ) : this.state.manifest ? (
          <div>
            <ExtensionViewContainer
              deleteExtensionViewHandler={this.deleteExtensionView}
              extensionViews={this.state.extensionViews}
              manifest={this.state.manifest}
              secret={this.state.secret}
              openEditViewHandler={this.openEditViewHandler}
              openExtensionViewHandler={this.openExtensionViewHandler}
            />
            {this.state.showingExtensionsView && (
              <ExtensionViewDialog
                channelId="999999999"
                extensionViews={this.state.manifest.views}
                closeHandler={this.closeExtensionViewDialog}
                saveHandler={this.createExtensionView}
              />
            )}
            {this.state.showingEditView && (
              <EditViewDialog
                idToEdit={this.state.idToEdit}
                views={this.getStoredRigExtensionViews()}
                closeHandler={this.closeEditViewHandler}
                saveViewHandler={this.editViewHandler}
              />
            )}
            {this.state.showingConfigurations && (
              <RigConfigurationsDialog
                config={this.state.manifest}
                closeConfigurationsHandler={this.closeConfigurationsHandler}
                refreshConfigurationsHandler={this.fetchInitialConfiguration}
              />
            )}
            <Console />
          </div>
        ) : (
          <label>loading...</label>
        )}
      </div>
    );
  }

  public pushExtensionViews(newViews: RigExtensionView[]) {
    this.storeExtensionViews(newViews);
    this.setState({
      extensionViews: newViews,
    });
  }

  private fetchInitialConfiguration = () => {
    if (this.state.clientId && this.state.version && this.state.secret && this.state.userId) {
      const tokenSpec: TokenSpec = {
        role: RigRole,
        secret: this.state.secret,
        userId: this.state.userId,
      };
      const token = createSignedToken(tokenSpec);
      fetchExtensionManifest(this.state.clientId, this.state.version, token)
        .then(this.onConfigurationSuccess)
        .catch(this.onConfigurationError);
    }
  }

  private initLocalStorage() {
    const extensionViews = this.getStoredRigExtensionViews();
    if (extensionViews.length) {
      const remapped = extensionViews.map((view, index) => ({
        ...view,
        id: (index + 1).toString(),
      }));

      this.setState({ extensionViews: remapped });
    } else {
      this.storeExtensionViews([]);
    }
  }

  private async setLogin() {
    const windowHash = window.location.hash;
    if (windowHash.includes('access_token')) {
      const accessTokenKey = 'access_token=';
      const accessTokenIndex = windowHash.indexOf(accessTokenKey);
      const ampersandIndex = windowHash.indexOf('&');
      const accessToken = windowHash.substring(accessTokenIndex + accessTokenKey.length, ampersandIndex);

      try {
        const response = await fetchUser(accessToken);
        const userSession = {
          authToken: accessToken,
          displayName: response.display_name,
          id: response.id,
          login: response.login,
          profileImageUrl: response.profile_image_url,
        };

        this.props.userLogin(userSession);
        localStorage.setItem(LocalStorageKeys.RigLogin, JSON.stringify(userSession));
        window.location.assign('/');
      } catch (error) {
        this.setState({ error });
      }
    } else {
      const rigLogin = localStorage.getItem(LocalStorageKeys.RigLogin);
      if (rigLogin) {
        try {
          const userSession = JSON.parse(rigLogin) as UserSession;
          if (userSession && userSession.authToken && userSession.id && userSession.login && userSession.profileImageUrl) {
            this.props.userLogin(userSession);
            this.state.userId = userSession.id;
          } else {
            localStorage.removeItem(LocalStorageKeys.RigLogin);
          }
        } catch (ex) {
          localStorage.removeItem(LocalStorageKeys.RigLogin);
        }
      }
    }
  }

  private getStoredRigExtensionViews(): RigExtensionView[] {
    const stored = localStorage.getItem(LocalStorageKeys.RigExtensionViews);
    if (stored) {
      return JSON.parse(stored) as RigExtensionView[];
    }

    return [];
  }

  private storeExtensionViews(rigExtensionViews: RigExtensionView[]) {
    localStorage.setItem(LocalStorageKeys.RigExtensionViews, JSON.stringify(rigExtensionViews));
  }
}
