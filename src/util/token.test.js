import jwt from 'jsonwebtoken';
import { createToken, createSignedToken } from './token';
import { ViewerTypes } from '../constants/viewer-types';
import { RIG_ROLE } from '../constants/rig';

describe('token', () => {
  const secret = new Buffer('secret', 'base64');
  const role = 'rig_role';
  const ouid = 'rig_ouid';
  const uid = 'rig_uid';
  const channelId = 'rig_channel';
  const ownerId = 'rig_owner';
  const isLinked = false;


  describe('createSignedToken', () => {
    const expected = {
      opaqueUserId: ouid,
      userId: uid,
      role: role,
      channelId: channelId,
    }

    it('should leave userId out if it is not specified', () => {
      const token = createSignedToken(role, ouid, '', channelId, secret);
      const payload = jwt.verify(token, secret);

      expect(payload.opaque_user_id).toBe(expected.opaqueUserId);
      expect(payload.channel_id).toBe(expected.channelId);
      expect(payload.role).toBe(expected.role);
      expect(payload.user_id).toBeUndefined();
    });

    it('should have userId if it is specified', () => {
      const token = createSignedToken(role, ouid, uid, channelId, secret);
      const payload = jwt.verify(token, secret);

      expect(payload.opaque_user_id).toBe(expected.opaqueUserId);
      expect(payload.channel_id).toBe(expected.channelId);
      expect(payload.role).toBe(expected.role);
      expect(payload.user_id).toBe(expected.userId);
    });
  });

  describe('createToken', () => {
    const LOGGED_OUT_PAYLOAD = {
      channel_id: channelId,
      opaque_user_id: 'ARIG00000',
      pubsub_perms: {
        listen: [],
        send: [],
      },
      role: 'viewer',
    };

    const LOGGED_IN_UNLINKED_PAYLOAD = {
      channel_id: channelId,
      opaque_user_id: 'URIG00000',
      pubsub_perms: {
        listen: [],
        send: [],
      },
      role: 'viewer',
    };

    const LOGGED_IN_LINKED_PAYLOAD = {
      channel_id: channelId,
      opaque_user_id: 'URIG00000',
      pubsub_perms: {
        listen: [],
        send: [],
      },
      role: 'viewer',
      user_id: 'RIG'+ownerId,
    };

    const BROADCASTER_PAYLOAD = {
      channel_id: channelId,
      opaque_user_id: 'URIG'+ownerId,
      pubsub_perms: {
        listen: [],
        send: [],
      },
      role: 'broadcaster',
      user_id: 'RIG'+ownerId,
    };

    it('should create a token for logged out unlinked users', () => {
      const token = createToken(ViewerTypes.LoggedOut, isLinked, ownerId, channelId, secret);
      const payload = jwt.verify(token, secret);

      expect(payload.opaque_user_id).toBe(LOGGED_OUT_PAYLOAD.opaque_user_id);
      expect(payload.role).toBe(LOGGED_OUT_PAYLOAD.role);
    });

    it('should create a token for logged in unlinked users', () => {
      const token = createToken(ViewerTypes.LoggedIn, isLinked, ownerId, channelId, secret);
      const payload = jwt.verify(token, secret);
      expect(payload.opaque_user_id).toBe(LOGGED_IN_UNLINKED_PAYLOAD.opaque_user_id);
      expect(payload.role).toBe(LOGGED_IN_UNLINKED_PAYLOAD.role);
    });

    it('should create a token for logged in linked users', () => {
      const token = createToken(ViewerTypes.LoggedIn, !isLinked, ownerId, channelId, secret);
      const payload = jwt.verify(token, secret);

      expect(payload.opaque_user_id).toBe(LOGGED_IN_LINKED_PAYLOAD.opaque_user_id);
      expect(payload.user_id).toBe(LOGGED_IN_LINKED_PAYLOAD.user_id);
      expect(payload.role).toBe(LOGGED_IN_LINKED_PAYLOAD.role);
    });

    it('should create a token for broadcaster users', () => {
      const token = createToken(ViewerTypes.Broadcaster, isLinked, ownerId, channelId, secret);
      const payload = jwt.verify(token, secret);

      expect(payload.opaque_user_id).toBe(BROADCASTER_PAYLOAD.opaque_user_id);
      expect(payload.role).toBe(BROADCASTER_PAYLOAD.role);
      expect(payload.user_id).toBe(BROADCASTER_PAYLOAD.user_id)
    });

    it('should create a token for the rig', () => {
      const token = createToken(RIG_ROLE, isLinked, ownerId, channelId, secret);
      const payload = jwt.verify(token, secret);

      expect(payload.role).toBe(RIG_ROLE);
    });
  });
});
