const { ExtensionViewType, ExtensionPlatform } = window['extension-coordinator'];

const extensionTypes = {};
extensionTypes[ExtensionViewType.VideoOverlay] = "Overlay";
extensionTypes[ExtensionViewType.Panel] = "Panel";
extensionTypes[ExtensionViewType.Component] = "Component";
extensionTypes[ExtensionPlatform.Mobile] = "Mobile";

export const ExtensionViewTypes = Object.freeze(extensionTypes);
export const DEFAULT_EXTENSION_TYPE = ExtensionViewType.VideoOverlay;
