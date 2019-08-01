import { createRoot, deleteRoot } from './utils';
import { ReactDOM } from '../src';
import { useStateVNode } from './fixtures/useState';

describe('function component', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = createRoot();
  });

  afterEach(() => {
    deleteRoot(root);
  });

  it('should render correct DOM', () => {
    ReactDOM.render(useStateVNode, root);
    expect(root).toMatchSnapshot();
  });

  it('should render correct DOM after virtual dom diff', () => {
    ReactDOM.render(useStateVNode, root);
    const addButton = root.querySelector('#add') as HTMLButtonElement;
    const result = root.querySelector('#result') as HTMLSpanElement;
    expect(result.innerHTML).toBe('0');
    addButton.click();
    expect(result.innerHTML).toBe("1");
  });
});
