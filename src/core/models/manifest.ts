import { ExtensionAnchor, ExtensionPlatform } from '../../constants/extension-coordinator';

export interface ExtensionManifest {
  author_name: string;
  bits_enabled: boolean;
  description: string;
  icon_urls: {
    '100x100': string;
    '24x24'?: string;
    '300x200'?: string;
  };
  id: string;
  name: string;
  request_identity_link: boolean;
  sku: string;
  summary: string;
  vendor_code: string;
  version: string;
  views: {
    component?: {
      viewer_url: string;
      aspect_height: number;
      aspect_width: number;
      can_link_external_content: boolean;
      size: number;
      zoom: boolean;
      zoom_pixels: number;
    };
    config?: {
      can_link_external_content: boolean;
      viewer_url: string;
    };
    hidden?: {
      can_link_external_content: boolean;
      viewer_url: string;
    };
    live_config?: {
      can_link_external_content: boolean;
      viewer_url: string;
    };
    mobile?: {
      viewer_url: string;
    };
    panel?: {
      can_link_external_content: boolean;
      height: number;
      viewer_url: string;
    };
    video_overlay?: {
      can_link_external_content: boolean;
      viewer_url: string;
    };
  };
  state: string;
  whitelisted_config_urls: string[];
  whitelisted_panel_urls: string[];
}

export function getSupportedAnchors(views: ExtensionCoordinator.ExtensionViews): ExtensionAnchor[] {
  const anchors = [];
  if (views.videoOverlay && views.videoOverlay.viewerUrl) {
    anchors.push(ExtensionAnchor.Overlay);
  }

  if (views.panel && views.panel.viewerUrl) {
    anchors.push(ExtensionAnchor.Panel);
  }

  if (views.component && views.component.viewerUrl) {
    anchors.push(ExtensionAnchor.Component);
  }

  return anchors;
}

export function getSupportedPlatforms(views: ExtensionCoordinator.ExtensionViews): ExtensionPlatform[] {
  const platforms = [ExtensionPlatform.Web];

  if (views.mobile && views.mobile.viewerUrl) {
    platforms.push(ExtensionPlatform.Mobile);
  }

  return platforms;
}
