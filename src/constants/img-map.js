import panel from '../img/panel.png';
import panelOff from '../img/panelOff.png';
import overlay from '../img/overlay.png';
import overlayOff from '../img/overlayOff.png';
import component from '../img/component.png';
import componentOff from '../img/componentOff.png';
import mobile from '../img/mobile.png';
import mobileOff from '../img/mobileOff.png';
const { ExtensionViewType, ExtensionPlatform  } = window['extension-coordinator'];

const imgMap = {};
imgMap[ExtensionViewType.VideoOverlay] = {
  on: overlay,
  off: overlayOff,
};

imgMap[ExtensionViewType.Panel] = {
  on: panel,
  off: panelOff,
};

imgMap[ExtensionViewType.Component] = {
  on: component,
  off: componentOff,
};

imgMap[ExtensionPlatform.Mobile] = {
  on: mobile,
  off: mobileOff,
};

export const ViewTypeImages = Object.freeze(imgMap);
