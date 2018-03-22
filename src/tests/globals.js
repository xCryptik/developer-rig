export function mockGlobals() {
  global.window.rig = {};
  global.window.rig.history = [];

  const coordinator = {}
  coordinator.ExtensionMode = {
    Viewer: 'viewer',
    Dashbord: 'dashboard',
    Config: 'config',
  };

  coordinator.ExtensionViewType = {
    Config: 'config',
    Component: 'component',
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

