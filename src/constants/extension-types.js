const { ExtensionAnchor } = window['extension-coordinator'];

const extensionTypes = {};
extensionTypes[ExtensionAnchor.Overlay] = "Overlay";
extensionTypes[ExtensionAnchor.Panel] = "Panel";

export const ExtensionAnchors = Object.freeze(extensionTypes);
export const DEFAULT_EXTENSION_TYPE = ExtensionAnchor.Overlay;
