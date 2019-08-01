import { createRoot, deleteRoot } from './utils';
import { ReactDOM } from '../src';
import { UseContextVNode } from './fixtures/useContext';

describe('useContext', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = createRoot();
  });

  afterEach(() => {
    deleteRoot(root);
  });

  it('should get the correct context value', () => {
    ReactDOM.render(UseContextVNode, root);
    const contextChilds = root.querySelectorAll('.context-child') as NodeListOf<HTMLDivElement>;
    const countButton = root.querySelector('#count') as HTMLButtonElement;
    expect(contextChilds[0].innerHTML).toBe('0');
    // expect(contextChilds[1].innerHTML).toBe('0');
    countButton.click();
    expect(contextChilds[0].innerHTML).toBe('1');
    // expect(contextChilds[1].innerHTML).toBe('1');
  });
});
