import { render, setAttribute } from './render';
import {
  isUnRenderVDom,
  isSameNodeType,
  isString,
  isFunction
} from './utils';
import { VNode, ReactHtmlElement, ReactElement, MountElement } from '../../typings/index';

export function diff(dom: ReactHtmlElement, vdom: VNode, parent?: ReactHtmlElement | null): ReactHtmlElement {
  const replace = parent ? (el: MountElement) => parent.replaceChild(el, dom) : ((el: any) => el);
  // 不能渲染的 vdom 对象，先转成空字符串
  vdom = isUnRenderVDom(vdom) ? '' : vdom;
  // 把数字先转成字符串
  vdom = typeof vdom === 'number' ? String(vdom) : vdom;

  // 节点类型不同，节点重新渲染
  if (!isSameNodeType(dom, vdom)) {
    dom.__componentInstance.cleanup();
    return replace(render(vdom, parent));
  }

  // 节点类型相同，做具体的 diff 操作
  // 文本节点
  if (isString(vdom)) {
    return dom.textContent !== vdom ? replace(document.createTextNode(String(vdom))) : dom;
  }

  // DOM 节点
  if (typeof vdom === 'object' && vdom !== null && isString(vdom.type)) {
    return diffNativeDom(dom, vdom);
  }

  // Component 组件
  if (typeof vdom === 'object' && vdom !== null && isFunction(vdom.type)) {
    const instance = dom.__componentInstance;
    return instance._update();
  }

  throw new Error(`unkown vdom type: ${String(vdom)}`);
}

function diffNativeDom(dom: any, vdom: ReactElement) {
  const pool: {
    [key: string]: ReactHtmlElement;
  } = {};

  [...dom.childNodes].forEach((child, index) => {
    const key = child.__key || `__index_${index}`;
    pool[key] = child;
  });

  [...vdom.children].forEach((child, index) => {
    const key = child.props && child.props.key || `__index_${index}`;
    pool[key] ? diff(pool[key], child, dom) : render(child, dom);
    delete pool[key];
  });

  for (const key in pool) {
    const instance = pool[key].__componentInstance;
    instance.cleanup();
    if (instance && instance.componentWillUnmount) {
      instance.componentWillUnmount();
    }
    pool[key].remove();
  }

  diffAttributes(dom, vdom);

  return dom;
}

function diffAttributes(dom: ReactHtmlElement, vdom: ReactElement) {
  const attrs = dom.attributes as any;
  const props = vdom.props;

  for (let attr of attrs) {
    const attrName = attr.name === 'class' ? 'className' : attr.name;

    if (!(attrName in props)) {
      dom.removeAttribute(attr.name);
    }
  }

  for (let prop in props) {
    setAttribute(dom, prop, (vdom.props as any)[prop]);
  }
}
