import { createRoot, deleteRoot } from './utils';
import { ReactDOM } from '../src';
import { UseCallbackVNode } from './fixtures/useReducer';

describe('useReducer', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = createRoot();
  });

  afterEach(() => {
    deleteRoot(root);
  });

  it('should get correct state after dispatch action', () => {
    ReactDOM.render(UseCallbackVNode, root);
    const increaseButton = root.querySelector('#increase') as HTMLButtonElement;
    const decreaseButton = root.querySelector('#decrease') as HTMLButtonElement;
    const resetButton = root.querySelector('#reset') as HTMLButtonElement;
    const result = root.querySelector('#result') as HTMLSpanElement;
    expect(result.innerHTML).toBe('0');
    increaseButton.click();
    expect(result.innerHTML).toBe('1');
    resetButton.click();
    expect(result.innerHTML).toBe('0');
    decreaseButton.click();
    expect(result.innerHTML).toBe('-1');
  });
});
