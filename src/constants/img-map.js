import panel from '../img/panel.png';
import overlay from '../img/overlay.png';
const { ExtensionAnchor } = window['extension-coordinator'];

const imgMap = {};
imgMap[ExtensionAnchor.Overlay] = overlay;
imgMap[ExtensionAnchor.Panel] = panel;

export const ViewTypeImages = Object.freeze(imgMap);
