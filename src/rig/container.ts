import { connect, Dispatch } from 'react-redux';
import { RigComponent, ReduxDispatchProps, RigProps } from './component';
import * as extensionActions from '../core/actions/extensions';
import * as userActions from '../core/actions/user-session';
import { GlobalState } from '../core/models/global-state';

function mapDispatchToProps(dispatch: Dispatch<GlobalState>): ReduxDispatchProps {
  return {
    saveManifest: manifest => dispatch(extensionActions.saveManifest(manifest)),
    userLogin: userSession => dispatch(userActions.userLogin(userSession))
  };
}

export const Rig = connect(null, mapDispatchToProps)(RigComponent);
