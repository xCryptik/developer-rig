import { createToken } from './token';
import { ExtensionManifest } from '../core/models/manifest';

export function createExtensionObject(
  manifest: ExtensionManifest,
  index: string,
  role: string,
  isLinked: boolean,
  ownerID: string,
  channelId: string,
  secret: string,
  opaqueId: string
): ExtensionCoordinator.ExtensionObject {
  return {
    authorName: manifest.author_name,
    bitsEnabled: manifest.bits_enabled,
    clientId: manifest.id,
    description: manifest.description,
    iconUrl: manifest.icon_urls["100x100"],
    id: manifest.id + ':' + index,
    name: manifest.name,
    requestIdentityLink: manifest.request_identity_link,
    sku: manifest.sku,
    state: manifest.state as ExtensionCoordinator.ExtensionState,
    summary: manifest.summary,
    token: createToken(role, isLinked, ownerID, channelId, secret, opaqueId),
    vendorCode: manifest.vendor_code,
    version: manifest.version,
    views: convertViews(manifest.views),
    whitelistedConfigUrls: manifest.whitelisted_config_urls,
    whitelistedPanelUrls: manifest.whitelisted_panel_urls,
  };
}

export function convertViews(data: ExtensionManifest['views']): ExtensionCoordinator.ExtensionViews {
  const views: ExtensionCoordinator.ExtensionViews = {};

  if (data.component) {
    views.component = {
      aspectHeight: data.component.aspect_height,
      aspectWidth: data.component.aspect_width,
      canLinkExternalContent: data.component.can_link_external_content,
      viewerUrl: data.component.viewer_url,
      zoom: data.component.zoom,
      zoomPixels: data.component.zoom_pixels,
    };
  }

  if (data.config) {
    views.config = {
      canLinkExternalContent: data.config.can_link_external_content,
      viewerUrl: data.config.viewer_url,
    };
  }

  if (data.live_config) {
    views.liveConfig = {
      canLinkExternalContent: data.live_config.can_link_external_content,
      viewerUrl: data.live_config.viewer_url,
    };
  }

  if (data.mobile) {
    views.mobile = { viewerUrl: data.mobile.viewer_url };
  }

  if (data.panel) {
    views.panel = {
      canLinkExternalContent: data.panel.can_link_external_content,
      height: data.panel.height,
      viewerUrl: data.panel.viewer_url,
    };
  }

  if (data.video_overlay) {
    views.videoOverlay = {
      canLinkExternalContent: data.video_overlay.can_link_external_content,
      viewerUrl: data.video_overlay.viewer_url,
    };
  }

  return views;
}
