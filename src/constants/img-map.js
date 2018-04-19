import panel from '../img/panel.png';
import panelOff from '../img/panelOff.png';
import overlay from '../img/overlay.png';
import overlayOff from '../img/overlayOff.png';
import component from '../img/component.png';
import componentOff from '../img/componentOff.png';
const { ExtensionAnchor } = window['extension-coordinator'];

const imgMap = {};
imgMap[ExtensionAnchor.Overlay] = {
  on: overlay,
  off: overlayOff,
};

imgMap[ExtensionAnchor.Panel] = {
  on: panel,
  off: panelOff,
};

imgMap[ExtensionAnchor.Component] = {
  on: component,
  off: componentOff,
};
export const ViewTypeImages = Object.freeze(imgMap);
