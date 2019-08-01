import { ReactDOM, React, useState } from './../src';
import { createRoot, deleteRoot, sleep } from './utils';
import { UseEffectComponent } from './fixtures/useEffect';

describe('useEffect', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = createRoot();
  });

  afterEach(() => {
    deleteRoot(root);
  });

  it('should cleanup before re-run useEffect function', async () => {
    const runEffectFn = jest.fn();
    const cleanupFn = jest.fn();
    ReactDOM.render(React.createElement(UseEffectComponent, { runEffectFn, cleanupFn }), root);
    const toggle = root.querySelector('#toggle') as HTMLButtonElement;
    expect(cleanupFn).toBeCalledTimes(0);
    await sleep(50);
    toggle.click();
    await sleep(50);
    expect(cleanupFn).toBeCalledTimes(1);
  });

  it('should not run Effect when args are equal', async () => {
    const runEffectFn = jest.fn();
    const cleanupFn = jest.fn();
    ReactDOM.render(React.createElement(UseEffectComponent, { runEffectFn, cleanupFn }), root);
    const count = root.querySelector('#count') as HTMLButtonElement;
    await sleep(50);
    expect(runEffectFn).toBeCalledTimes(1);
    count.click();
    await sleep(50);
    expect(runEffectFn).toBeCalledTimes(1);
  });

  it('should cleanup when component unmount', async () => {
    const runEffectFn = jest.fn();
    const cleanupFn = jest.fn();
    const vnode = React.createElement(
      function () {
        const [ toggle, setToggle ] = useState(false);
        return React.createElement(
          'div',
          {},
          toggle
          ? React.createElement('div', {}, 'temp')
          : React.createElement(UseEffectComponent, { runEffectFn, cleanupFn }),
          React.createElement('div', { id: 'toggle', onClick: () => setToggle(!toggle) }, 'toggle')
        );
      }
    );
    ReactDOM.render(vnode, root);
    const toggleButton = root.querySelector('#toggle') as HTMLButtonElement;
    await sleep(50);
    toggleButton.click();
    await sleep(50);
    expect(cleanupFn).toBeCalledTimes(1);
  });
});
