import { createSignedToken, TokenPayload } from './token';
import { verify } from 'jsonwebtoken';

describe('token', () => {
  const secret = 'secret';
  const role = 'rig_role';
  const opaqueUserId = 'rig_ouid';
  const userId = 'rig_uid';
  const channelId = 'rig_channel';
  const ownerId = 'rig_owner';
  const isLinked = false;

  describe('createSignedToken', () => {
    const expected = {
      opaqueUserId,
      userId,
      role,
      channelId,
    }

    it('should leave userId out if it is not specified', () => {
      const token = createSignedToken({ role, opaqueUserId, channelId, secret });
      const payload = verify(token, Buffer.from(secret, 'base64')) as TokenPayload;

      expect(payload.opaque_user_id).toBe(expected.opaqueUserId);
      expect(payload.channel_id).toBe(expected.channelId);
      expect(payload.role).toBe(expected.role);
      expect(payload.user_id).toBeUndefined();
    });

    it('should have userId if it is specified', () => {
      const token = createSignedToken({ role, opaqueUserId, userId, channelId, secret });
      const payload = verify(token, Buffer.from(secret, 'base64')) as TokenPayload;

      expect(payload.opaque_user_id).toBe(expected.opaqueUserId);
      expect(payload.channel_id).toBe(expected.channelId);
      expect(payload.role).toBe(expected.role);
      expect(payload.user_id).toBe(expected.userId);
    });
  });
});
