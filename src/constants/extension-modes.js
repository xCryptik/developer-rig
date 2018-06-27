const { ExtensionViewType, ExtensionMode, ExtensionPlatform } = window['extension-coordinator'];

let modeToView = {}
modeToView[ExtensionMode.Config] = ExtensionViewType.Config;
modeToView[ExtensionMode.Dashboard] = ExtensionViewType.LiveConfig;
modeToView[ExtensionPlatform.Mobile] = ExtensionPlatform.Mobile;

export const EXTENSION_MODE_TO_VIEW = Object.freeze(modeToView);
