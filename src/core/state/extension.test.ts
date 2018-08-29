import * as extensionActions from '../actions/extensions';
import { extensionsReducer, ExtensionsState } from './extensions';
import { createExtensionManifestForTest } from '../../tests/constants/extension';

describe('Extensions', () => {
  let state: ExtensionsState;

  it('returns a correct inital state', () => {
    state = extensionsReducer(undefined, { type: 'INIT' } as any);
    expect(state.manifest).toBeUndefined();
  });

  it('sets a correct extension manifest', () => {
    const manifest = createExtensionManifestForTest();
    state = extensionsReducer(undefined, extensionActions.saveManifest(manifest));
    expect(state.manifest).toEqual(manifest);
  });
});
