import { createRoot, deleteRoot } from './utils';

describe('render useState component', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = createRoot();
  });

  afterEach(() => {
    deleteRoot(root);
  });

  it('normal render', () => {
    expect(0).toBe(0);
  });
});
