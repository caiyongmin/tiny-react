import { createRoot, deleteRoot } from './utils';
import { ReactDOM } from '../src';
import { useRefVNode } from './fixtures/useRef';

describe('useRef', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = createRoot();
  });

  afterEach(() => {
    deleteRoot(root);
  });

  it('should input element has focused', () => {
    ReactDOM.render(useRefVNode, root);
    const input = root.querySelector('input') as HTMLInputElement
    const focusButton = root.querySelector('#focus') as HTMLButtonElement;

    focusButton.click();
    expect(document.activeElement).toBe(input);
  });
});
