import { connect } from 'react-redux';
import { GlobalState } from '../core/models/global-state';
import { ExtensionFrameComponent, ReduxStateProps, PublicProps } from './component';
import { getUserSession } from '../core/state/session';

function mapStateToProps(state: GlobalState): ReduxStateProps {
  const user = getUserSession(state);

  return {
    channelId: user && user.id,
  };
}

export const ExtensionFrame = connect<ReduxStateProps, {}, PublicProps>(mapStateToProps)(ExtensionFrameComponent);
