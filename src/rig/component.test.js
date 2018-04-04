import { setupShallowTest } from '../tests/enzyme-util/shallow';
import { createViewsForTest, ExtensionForTest } from '../tests/constants/extension';
import { mockFetchForManifest } from '../tests/mocks';
import { EXTENSION_VIEWS, BROADCASTER_CONFIG, LIVE_CONFIG } from '../constants/nav-items';
import { Rig } from './component';
const { ExtensionMode } = window['extension-coordinator'];

describe('<Rig />', () => {
  const setupShallow = setupShallowTest(Rig, () => { });
  const setupViewsForTest = numViews => {
    const testViews = createViewsForTest(numViews);
    localStorage.setItem('extensionViews', JSON.stringify(testViews));
  };

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(mockFetchForManifest);
  })

  it('renders correctly', () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });

  it('gets extension views from local storage correctly when not in local storage', () => {
    const { wrapper } = setupShallow();
    expect(wrapper.instance()._getExtensionViews()).toEqual([]);
  });

  it('renders extension view correctly', () => {
    setupViewsForTest(1);
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ExtensionViewContainer').props().extensionViews).toHaveLength(1);
  });

  it('gets extension views from local storage correctly', () => {
    setupViewsForTest(1);
    const testViews = createViewsForTest(1);
    const { wrapper } = setupShallow();
    expect(wrapper.instance()._getExtensionViews()).toEqual(testViews);
  });

  it('deletes extension view correctly', () => {
    setupViewsForTest(1);
    const { wrapper } = setupShallow();
    expect(wrapper.find('ExtensionViewContainer').props().extensionViews).toHaveLength(1);

    wrapper.instance()._boundDeleteExtensionView('1');
    wrapper.update();
    expect(wrapper.find('ExtensionViewContainer').props().extensionViews).toHaveLength(0);
  });

  it('correctly toggles state when configuration dialog is opened/closed', () => {
    setupViewsForTest(1);
    const { wrapper } = setupShallow();
    wrapper.instance().openConfigurationsHandler();
    expect(wrapper.instance().state.showConfigurations).toBe(true);


    wrapper.instance().closeConfigurationsHandler();
    expect(wrapper.instance().state.showConfigurations).toBe(false);
  });

  it('correctly toggles state when create extension view is opened/closed', () => {
    setupViewsForTest(1);
    const { wrapper } = setupShallow();
    wrapper.setState({
      manifest: ExtensionForTest,
    })
    wrapper.instance().openExtensionViewHandler();
    expect(wrapper.instance().state.showExtensionsView).toBe(true);


    wrapper.instance().closeExtensionViewDialog();
    expect(wrapper.instance().state.showExtensionsView).toBe(false);
  });

  it('correctly sets state when viewHandler is invoked', () => {
    setupViewsForTest(1);
    const { wrapper } = setupShallow();

    wrapper.instance().viewerHandler();
    expect(wrapper.instance().state.mode).toBe(ExtensionMode.Viewer);
    expect(wrapper.instance().state.selectedView).toBe(EXTENSION_VIEWS);
    expect(wrapper.instance().state.extension).toEqual({});
  });


  it('correctly sets state when configHandler is invoked', () => {
    setupViewsForTest(1);
    const { wrapper } = setupShallow();

    wrapper.instance().configHandler();
    expect(wrapper.instance().state.mode).toBe(ExtensionMode.Config);
    expect(wrapper.instance().state.selectedView).toBe(BROADCASTER_CONFIG);
  });

  it('correctly sets state when liveConfigHandler is invoked', () => {
    setupViewsForTest(1);
    const { wrapper } = setupShallow();
    wrapper.instance().liveConfigHandler();
    expect(wrapper.instance().state.mode).toBe(ExtensionMode.Dashboard);
    expect(wrapper.instance().state.selectedView).toBe(LIVE_CONFIG);
  });

  it('gets the correct views when _getExtensionViews invoked', () => {
    const testViews = createViewsForTest(1);
    setupViewsForTest(1);
    const { wrapper } = setupShallow();

    expect(wrapper.instance().state.extensionViews).toEqual(testViews);
  });

  it('sets views in local storage correctly when _pushExtensionViews invoked', () => {
    const testViews = createViewsForTest(1);
    setupViewsForTest(1);
    const { wrapper } = setupShallow();
    expect(wrapper.instance().state.extensionViews).toEqual(testViews);

    wrapper.instance().state.extensionViews.push(createViewsForTest(1));
    wrapper.instance()._pushExtensionViews(wrapper.instance().state.extensionViews);
  });

  it('sets state correctly when _onConfigurationSuccess invoked', () => {
    const { wrapper } = setupShallow();
    const testData = {
      test: 'test'
    };
    wrapper.instance()._onConfigurationSuccess(testData);
    expect(wrapper.instance().state.test).toBe(testData.test);
  });

  it('sets error state correctly when _onConfigurationError invoked', () => {
    const { wrapper } = setupShallow();
    const testError = 'error';
    wrapper.instance()._onConfigurationError(testError);
    expect(wrapper.instance().state.error).toBe(testError);
  });
});
