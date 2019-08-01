import { createRoot, deleteRoot, createKeyboardEvent } from './utils';
import { ReactDOM } from '../src';
import { useCallbackVNode } from './fixtures/useCallback';

describe('useCallback', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = createRoot();
  });

  afterEach(() => {
    deleteRoot(root);
  });

  it('should input value change link the result innerHtml change', async () => {
    ReactDOM.render(useCallbackVNode, root);
    const input = root.querySelector('input') as HTMLInputElement;
    const result = root.querySelector('#result') as HTMLDivElement;
    const inputEvent = createKeyboardEvent('input');
    let newValue = input.value + '2';

    input.value = newValue;
    input.dispatchEvent(inputEvent);
    expect(result.innerHTML).toBe(newValue);

    newValue += '3';
    input.value = newValue;
    input.dispatchEvent(inputEvent);
    expect(result.innerHTML).toBe(newValue);
  });
});
