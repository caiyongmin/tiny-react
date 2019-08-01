import { createRoot, deleteRoot } from './utils';
import { ReactDOM } from '../src';
import { UseContextVNode } from './fixtures/useContext';

describe('useMemo', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = createRoot();
  });

  afterEach(() => {
    deleteRoot(root);
  });

  it('should not re-render when args are equal', () => {
    ReactDOM.render(UseContextVNode, root);
    const countButton = root.querySelector('#count') as HTMLButtonElement;
    const contextMemoChild = root.querySelector('.context-memo-child') as HTMLDivElement;
    const commonChild = root.querySelector('.common-child') as HTMLDivElement;
    const oldMemoValue = contextMemoChild.innerHTML;
    const oldCommonValue = commonChild.innerHTML;
    countButton.click();
    expect(contextMemoChild.innerHTML).toBe(oldMemoValue);
    expect(commonChild.innerHTML).not.toBe(oldCommonValue);
  });
});
