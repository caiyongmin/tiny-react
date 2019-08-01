import { createRoot, deleteRoot } from './utils';
import { ReactDOM, React } from './../src';
import { DemoComponentVNode } from './fixtures/classComponent';
import { UseEffectComponent } from './fixtures/useEffect';

describe('ReactDOM diff', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = createRoot();
  });

  afterEach(() => {
    deleteRoot(root);
  });

  it('should render correct DOM when type is unkown vnode type', () => {
    expect(() => {
      ReactDOM.render(React.createElement('div', {}), root);
      const divEle = root.querySelector('div') as HTMLDivElement;
      ReactDOM.diff(divEle, { type: 0 } as any);
    }).toThrow('unkown vdom type: {"type":0}');
  });

  it('should render correct DOM when child need unmount, because key has changed', () => {
    const vnode = React.createElement(
      'div',
      {},
      React.createElement('div', { id: 'a', key: 'a' }),
      DemoComponentVNode,
      React.createElement(UseEffectComponent, {})
    );
    const diffVnode = React.createElement(
      'div',
      {},
      React.createElement('div', { id: 'b', key: '11' })
    );
    ReactDOM.render(vnode, root);
    const firstDivEle = root.querySelector('div') as HTMLDivElement;
    ReactDOM.diff(firstDivEle, diffVnode);
    const a = root.querySelector('#a') as HTMLDivElement;
    expect(a).toBe(null);
  });

  it('should render correct DOM when remove attribute', () => {
    const vnode = React.createElement(
      'div',
      {},
      React.createElement('div', { id: 'a', className: 'active' })
    );
    const diffVnode = React.createElement(
      'div',
      {},
      React.createElement('div', { id: 'a' })
    );
    ReactDOM.render(vnode, root);
    const firstDivEle = root.querySelector('div') as HTMLDivElement;
    const a = root.querySelector('#a') as HTMLDivElement;
    expect(a.className).toBe('active');
    ReactDOM.diff(firstDivEle, diffVnode);
    expect(a.className).toBe('');
  });
});
