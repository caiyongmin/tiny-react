import { createRoot, deleteRoot } from './utils';
import { ReactDOM, React } from './../src';

describe('ReactDOM render', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = createRoot();
  });

  afterEach(() => {
    deleteRoot(root);
  });

  it('should render correct DOM when type is unkown vnode type', () => {
    expect(() => {
      ReactDOM.render({ type: 0 } as any, root);
    }).toThrow('unkown vdom type: {"type":0}');
  });

  it('should render correct DOM when type is un-render vnode type', () => {
    const vnode = React.createElement(
      'div',
      {},
      React.createElement('span', {}, undefined),
      React.createElement('span', {}, null),
      React.createElement('span', {}, true),
      React.createElement('span', {}, false),
    );
    ReactDOM.render(vnode, root);
    const spans = root.querySelectorAll('span') as NodeListOf<HTMLSpanElement>;
    // render undefined
    expect(spans[0].innerHTML).toBe('');
    // render null
    expect(spans[1].innerHTML).toBe('');
    // render true
    expect(spans[2].innerHTML).toBe('');
    // render false
    expect(spans[3].innerHTML).toBe('');
  });

  it('should render correct DOM about native dom', () => {
    const vnode = React.createElement(
      'div',
      { id: 'temp', style: { fontSize: '16px', color: '#09f' } },
      'temp'
    );
    ReactDOM.render(vnode, root);
    expect(root.innerHTML).toBe('<div id="temp" style="font-size: 16px; color: rgb(0, 153, 255);">temp</div>');
  });

  it('should work when set ref prop', () => {
    // ref value is function
    // or is object which have current attribute
    let funcRef = null;
    let currentRef = { current: null };
    const vnode = React.createElement(
      'div',
      {},
      React.createElement('div', { id: 'func', ref: (c: any) => funcRef = c }),
      React.createElement('div', { id: 'current', ref: currentRef})
    );
    ReactDOM.render(vnode, root);
    const funcEle = root.querySelector('#func') as HTMLDivElement;
    const currentEle = root.querySelector('#current') as HTMLDivElement;
    expect(funcRef).toBe(funcEle);
    expect(currentRef.current).toBe(currentEle);
  });

  it('should work when set key prop', () => {
    const vnode = React.createElement(
      'div',
      { key: '1' },
    );
    ReactDOM.render(vnode, root);
    expect(root.innerHTML).toBe('<div></div>');
  });
});
