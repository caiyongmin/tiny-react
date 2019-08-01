import { createRoot, deleteRoot } from './utils';
import { ReactDOM } from '../src';
import { useStateVNode, SameStateValueVNode } from './fixtures/useState';

describe('useState', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = createRoot();
  });

  afterEach(() => {
    deleteRoot(root);
  });

  it('should render correct DOM after set state value', () => {
    ReactDOM.render(useStateVNode, root);
    const addButton = root.querySelector('#add') as HTMLButtonElement;
    const resetButton = root.querySelector('#reset') as HTMLButtonElement;
    const result = root.querySelector('#result') as HTMLSpanElement;
    expect(result.innerHTML).toBe('0');
    addButton.click();
    expect(result.innerHTML).toBe('1');
    addButton.click();
    expect(result.innerHTML).toBe('2');
    resetButton.click();
    expect(result.innerHTML).toBe('0');
  });

  it('should not re-render when set the same state value', () => {
    ReactDOM.render(SameStateValueVNode, root);
    const sameButton = root.querySelector('#same') as HTMLButtonElement;
    const date = root.querySelector('#date') as HTMLSpanElement;
    const currentDateStr = date.innerHTML;
    sameButton.click();
    const newDateStr = date.innerHTML;
    expect(currentDateStr).toBe(newDateStr);
  });
});
