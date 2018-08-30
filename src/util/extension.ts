import { ExtensionManifest } from '../core/models/manifest';
import { RigRole } from '../constants/rig';
import { ViewerTypes } from '../constants/viewer-types';
import { TokenSpec, createSignedToken } from './token';

export function createExtensionToken(newRole: string, isLinked: boolean, ownerId: string, channelId: string, secret: string, opaqueId: string): string {
  const opaque = opaqueId ? opaqueId : generateOpaqueId();
  switch (newRole) {
    case ViewerTypes.LoggedOut:
      return createSignedToken({ role: 'viewer', opaqueUserId: 'ARIG' + opaque, channelId, secret });
    case ViewerTypes.LoggedIn:
      if (isLinked) {
        return createSignedToken({ role: 'viewer', opaqueUserId: 'URIG' + opaque, userId: 'RIG' + ownerId, channelId, secret });
      } else {
        return createSignedToken({ role: 'viewer', opaqueUserId: 'URIG' + opaque, channelId, secret });
      }
    case ViewerTypes.Broadcaster:
      return createSignedToken({ role: 'broadcaster', opaqueUserId: 'URIG' + opaque, userId: 'RIG' + ownerId, channelId, secret });
    default:
      return createSignedToken({ role: RigRole, opaqueUserId: 'ARIG' + opaque, channelId, secret });
  }
}

const idSource: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const idLength: number = 15;

export function generateOpaqueId(): string {
  let id = '';
  for (let i = 0; i < idLength; i++) {
    id += idSource.charAt(Math.floor(Math.random() * idSource.length));
  }
  return id;
}

export function createExtensionObject(
  manifest: ExtensionManifest,
  index: string,
  role: string,
  isLinked: boolean,
  ownerId: string,
  channelId: string,
  secret: string,
  opaqueId: string
): ExtensionCoordinator.ExtensionObject {
  return {
    authorName: manifest.authorName,
    bitsEnabled: manifest.bitsEnabled,
    clientId: manifest.id,
    description: manifest.description,
    iconUrl: manifest.iconUrls["100x100"],
    id: manifest.id + ':' + index,
    name: manifest.name,
    requestIdentityLink: manifest.requestIdentityLink,
    sku: manifest.sku,
    state: manifest.state as ExtensionCoordinator.ExtensionState,
    summary: manifest.summary,
    token: createExtensionToken(role, isLinked, ownerId, channelId, secret, opaqueId),
    vendorCode: manifest.vendorCode,
    version: manifest.version,
    views: manifest.views,
    whitelistedConfigUrls: manifest.whitelistedConfigUrls,
    whitelistedPanelUrls: manifest.whitelistedPanelUrls,
  };
}
