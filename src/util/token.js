import { ViewerTypes } from '../constants/viewer-types';
import { RIG_ROLE } from '../constants/rig';
import jwt from 'jsonwebtoken';

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function createToken(newRole, isLinked, ownerID, channelId, secret) {
  switch (newRole) {
    case ViewerTypes.LoggedOut:
      return createSignedToken('viewer', 'ARIG00000', '', channelId, secret)
    case ViewerTypes.LoggedIn:
      if (isLinked) {
        return createSignedToken('viewer', 'URIG00000', 'RIG'+ownerID, channelId, secret)
      } else {
        return createSignedToken('viewer', 'URIG00000', '', channelId, secret)
      }
    case ViewerTypes.Broadcaster:
      return createSignedToken('broadcaster', 'URIG' + ownerID, 'RIG' + ownerID, channelId, secret)
    default:
      return createSignedToken(RIG_ROLE, 'ARIG0000', '', channelId, secret);
  }
}

export function createSignedToken(role, opaqueUserId, userId, channelId, secret) {
  const payload = {
    exp: Math.floor(((Date.now() + ONE_YEAR_MS) / 1000)),
    opaque_user_id: opaqueUserId,
    channel_id: channelId,
    role: role,
    pubsub_perms: {
      listen: ['broadcast'],
      send: ['*'],
    },
  };

  if (userId !== '') {
    payload['user_id'] = userId;
  }

  return jwt.sign(payload, new Buffer(secret, 'base64'), { algorithm: 'HS256' });
}
