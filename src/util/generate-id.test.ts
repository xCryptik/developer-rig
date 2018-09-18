import { generateId } from './generate-id';

describe('generateId', () => {
  it('generates an ID we expect', () => {
    const idLength = 15;
    const genOpaqueId = generateId(idLength);
    expect(genOpaqueId).toHaveLength(idLength);
  });
});
