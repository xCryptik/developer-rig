export function mockGlobals() {
  global.process.env.EXT_CLIENT_ID = 'test';
  global.process.env.EXT_SECRET = 'test';
  global.process.env.EXT_VERSION = 'test';
  global.process.env.EXT_CHANNEL_ID = 'test';
  global.process.env.EXT_USER_NAME = 'test';

  global.localStorage = {};
  global.localStorage.getItem = (key) => {
    if (!(key in global.localStorage)) {
      return null;
    }
    return global.localStorage[key];
  };

  global.localStorage.setItem = (key, value) => {
    global.localStorage[key] = value;
  };

  global.window.rig = {};
  global.window.rig.history = [];

  const coordinator = {}
  coordinator.ExtensionMode = {
    Viewer: 'viewer',
    Dashboard: 'dashboard',
    Config: 'config',
  };

  coordinator.ExtensionViewType = {
    Config: 'config',
    LiveConfig: 'liveConfig',
  };
  coordinator.ExtensionPlatform = {
    Web: 'web',
  };
  coordinator.ExtensionFrame = function () {
    return {
      on: () => { },
    }
  };
  coordinator.ExtensionAnchor = {
    Panel: 'panel',
    Overlay: 'video_overlay',
  };

  global.window['extension-coordinator'] = coordinator;
}

