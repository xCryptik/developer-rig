import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { createViewsForTest, createExtensionManifestForTest } from '../tests/constants/extension';
import { mockFetchForUserInfo } from '../tests/mocks';
import { RigComponent } from './component';
import { ExtensionAnchors } from '../constants/extension-types';
import { ViewerTypes } from '../constants/viewer-types';
import { RigProject } from '../core/models/rig';
import { ExtensionViewDialogState } from '../extension-view-dialog';
import { ExtensionAnchor, ExtensionViewType } from '../constants/extension-coordinator';
import { DefaultMobileSize } from '../constants/mobile';
import { DeveloperRigUserId } from '../constants/rig';

let globalAny = global as any;

function mockApiFunctions() {
  return {
    ...require.requireActual('../util/api'),
    fetchChannelConfigurationSegments: jest.fn().mockImplementation(() => Promise.resolve({})),
    saveConfigurationSegment: jest.fn(),
  };
}
jest.mock('../util/api', () => mockApiFunctions());
const api = require.requireMock('../util/api');
function mockIdFunctions() {
  return {
    ...require.requireActual('../util/id'),
    fetchIdForUser: jest.fn().mockImplementation((_, id) => id === 'developerrig' ?
      Promise.resolve(DeveloperRigUserId) : Promise.reject(new Error(`Cannot fetch user "${id}"`))),
  };
}
jest.mock('../util/id', () => mockIdFunctions());
const { fetchIdForUser } = require.requireMock('../util/id');

localStorage.setItem('projects', '[{"manifest":{}},{"manifest":{}}]');

const setupShallow = setupShallowTest(RigComponent, () => ({
  session: { displayName: 'test', login: 'test', id: 'test', profileImageUrl: 'test.png', authToken: 'test' },
  saveManifest: jest.fn(),
  userLogin: jest.fn(),
}));

describe('<RigComponent />', () => {
  function setUpProjectForTest(type: ExtensionAnchor) {
    const extensionViews = createViewsForTest(1, ExtensionAnchors[type], ViewerTypes.LoggedOut);
    localStorage.setItem('projects', JSON.stringify([{ extensionViews, manifest: {} }]));
    localStorage.setItem('currentProjectIndex', '0');
  }

  it('renders correctly', () => {
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      try {
        expect(wrapper).toMatchSnapshot();
        resolve();
      } catch (ex) {
        reject(ex.message);
      }
    });
  });

  it('gets extension views from local storage correctly', () => {
    setUpProjectForTest(ExtensionAnchor.Panel);
    const testViews = createViewsForTest(1, ExtensionAnchors[ExtensionAnchor.Panel], ViewerTypes.LoggedOut);
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          wrapper.update();
          const instance = wrapper.instance() as RigComponent;
          expect(instance.state.currentProject.extensionViews).toEqual(testViews);
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });

  it('deletes extension view correctly', () => {
    setUpProjectForTest(ExtensionAnchor.Panel);
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          wrapper.update();
          const instance = wrapper.instance() as RigComponent;
          expect(wrapper.state().currentProject.extensionViews).toHaveLength(1);
          instance.deleteExtensionView('1');
          wrapper.update();
          expect(wrapper.state().currentProject.extensionViews).toHaveLength(0);
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });

  it('edit changes the view and sets them correctly', () => {
    setUpProjectForTest(ExtensionAnchor.Component);
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          wrapper.update();
          const instance = wrapper.instance() as RigComponent;
          const views = instance.state.currentProject.extensionViews;
          const editedView = views[0];
          instance.editView(editedView, { x: 25, y: 25 });
          expect(editedView.x).toEqual(25);
          expect(editedView.y).toEqual(25);
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });

  it('correctly toggles state when create extension view is opened/closed', () => {
    setUpProjectForTest(ExtensionAnchor.Panel);
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          wrapper.update();
          const instance = wrapper.instance() as RigComponent;
          instance.state.currentProject = { manifest: createExtensionManifestForTest() } as RigProject;
          await instance.createExtensionView({ channelId: 'developerrig' } as ExtensionViewDialogState);
          wrapper.update();
          expect(fetchIdForUser).toHaveBeenCalled();
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });

  it('gets the correct views when getExtensionViews invoked', () => {
    const testViews = createViewsForTest(1, ExtensionAnchors[ExtensionAnchor.Panel], ViewerTypes.LoggedOut);
    setUpProjectForTest(ExtensionAnchor.Panel);
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          wrapper.update();
          const instance = wrapper.instance() as RigComponent;
          expect(instance.state.currentProject.extensionViews).toEqual(testViews);
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });

  it('returns correct data for mobile ', () => {
    const { wrapper } = setupShallow();
    const testDialogState = {
      width: 0,
      height: 0,
      mobileFrameSize: DefaultMobileSize,
      extensionViewType: ExtensionViewType.Mobile
    } as ExtensionViewDialogState;
    const expectedMobileFrameSize = {
      width: 375,
      height: 822,
    };
    const instance = wrapper.instance() as RigComponent;

    let frameSize = instance.getFrameSizeFromDialog(testDialogState);
    expect(frameSize).toEqual(expectedMobileFrameSize);
  });

  it('returns correct data for other types', () => {
    const { wrapper } = setupShallow();
    const overlayTestDialogState = {
      width: 0,
      height: 0,
      frameSize: '640x480',
      extensionViewType: ExtensionViewType.Overlay
    } as ExtensionViewDialogState;
    const expectedOverlayFrameSize = {
      width: 640,
      height: 480,
    };
    const instance = wrapper.instance() as RigComponent;
    const frameSize = instance.getFrameSizeFromDialog(overlayTestDialogState);
    expect(frameSize).toEqual(expectedOverlayFrameSize);
  });

  it('returns correct data for custom size', () => {
    const { wrapper } = setupShallow();
    const overlayTestDialogState = {
      width: 100,
      height: 100,
      frameSize: 'Custom',
      extensionViewType: ExtensionViewType.Overlay
    } as ExtensionViewDialogState;
    const expectedOverlayFrameSize = {
      width: 100,
      height: 100,
    };
    const instance = wrapper.instance() as RigComponent;
    const frameSize = instance.getFrameSizeFromDialog(overlayTestDialogState);
    expect(frameSize).toEqual(expectedOverlayFrameSize);
  });

  it('correctly fetches user info if login not in localStorage', () => {
    globalAny.fetch = jest.fn().mockImplementation(mockFetchForUserInfo);
    globalAny.window.location.hash = 'access_token=test&';

    setupShallow();
    expect(globalAny.fetch).toHaveBeenCalled();
  });

  globalAny.confirm = jest.fn().mockImplementation(() => true);
  globalAny.fetch = jest.fn().mockImplementation(() => Promise.resolve({
    status: 200,
    json: () => Promise.resolve({}),
  }));

  it('creates project', async () => {
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          wrapper.update();
          const instance = wrapper.instance() as RigComponent;
          const extensionViews = createViewsForTest(1, ExtensionAnchors[ExtensionAnchor.Panel], ViewerTypes.LoggedOut);
          await instance.createProject({ manifest: {}, extensionViews } as RigProject);
          expect(globalAny.fetch).toHaveBeenCalled();
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });

  it('selects project', async () => {
    setUpProjectForTest(ExtensionAnchor.Panel);
    const { wrapper } = setupShallow();
    const instance = wrapper.instance() as RigComponent;
    await instance.selectProject(1);
    expect(globalAny.fetch).toHaveBeenCalled();
  });

  it('deletes project', async () => {
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          wrapper.update();
          const currentProject = { manifest: createExtensionManifestForTest() } as RigProject;
          wrapper.setState({ currentProject });
          const instance = wrapper.instance() as RigComponent;
          await instance.deleteProject();
          expect(globalAny.confirm).toHaveBeenCalled();
          expect(instance.state.currentProject).not.toBe(currentProject);
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });

  it('renders and closes CreateProjectDialog', () => {
    setUpProjectForTest(ExtensionAnchor.Panel);
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const instance = wrapper.instance() as RigComponent;
          instance.showCreateProjectDialog();
          wrapper.update();
          expect(wrapper.find('CreateProjectDialog').length).toBe(1);
          instance.closeProjectDialog();
          wrapper.update();
          expect(wrapper.find('CreateProjectDialog').length).toBe(0);
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });

  it('saves configuration', () => {
    setUpProjectForTest(ExtensionAnchor.Panel);
    const { wrapper } = setupShallow();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const instance = wrapper.instance() as any;
          instance.saveConfiguration('segment', 'channelId', 'content', 'version');
          expect(api.saveConfigurationSegment).toHaveBeenCalled();
          resolve();
        } catch (ex) {
          reject(ex.message);
        }
      });
    });
  });

  it('correctly displays an error if user fetch fails', done => {
    const errorMessage = 'test';
    globalAny.fetch = jest.fn().mockImplementation(() => Promise.reject(new Error(errorMessage)));
    globalAny.window.location.hash = 'access_token=test&';
    const { wrapper } = setupShallow();
    setTimeout(() => {
      wrapper.update();
      expect(globalAny.fetch).toHaveBeenCalled();
      expect(wrapper.instance().state.error).toEqual(errorMessage);
      done();
    });
  });
});
