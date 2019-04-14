import { render, setAttribute } from './render';
import {
  isUnRenderVDom,
  isSameNodeType,
  isString,
  isFunction
} from './utils';
import { setDispatcher } from './../react/index';
import { ComponentElement, ReactVDOM, ReactElement } from '../../typings/index';

export function diff(dom: ReactVDOM, vdom: ComponentElement, parent?: any): ReactVDOM {
  const replace = parent ? (el: any) => (parent.replaceChild(el, dom) && el) : ((el: any) => el);
  // 不能渲染的 vdom 对象，先转成字符串
  vdom = isUnRenderVDom(vdom) ? '' : vdom;

  /* 节点类型不同，节点重新渲染 */
  if (!isSameNodeType(dom, vdom)) {
    // debugger;
    const newVDom = render(vdom, parent);
    return replace(newVDom);
  }

  /* 节点类型相同，做具体的 diff 操作 */
  // 文本节点
  if (isString(vdom)) {
    return dom.textContent !== vdom ? replace(document.createTextNode(String(vdom))) : dom;
  }

  // DOM 节点
  if (typeof vdom === 'object' && vdom !== null && isString(vdom.type)) {
    const pool: {
      [key: string]: ReactVDOM;
    } = {};

    [...dom.childNodes as any].forEach((child, index) => {
      const key = child.__key || `__index_${index}`;
      pool[key] = child;
    });
    [...vdom.children].forEach((child, index) => {
      const key = (typeof child === 'object' && child !== null)
        && child.props && child.props.key
        || `__index_${index}`;
      pool[key] ? diff(pool[key], child, dom) : render(child, dom);
      delete pool[key];
    });
    for (const key in pool) {
      const instance = pool[key].__componentInstance;
      if (instance && instance.componentWillUnmount) {
        instance.componentWillUnmount();
      }
      pool[key].remove();
    }
    diffAttributes(dom, vdom);
    return dom;
  }

  // Component 组件
  if (typeof vdom === 'object' && vdom !== null && isFunction(vdom.type)) {
    const instance = dom.__componentInstance;
    instance.props = {
      ...instance.props,
      ...vdom.props,
      children: vdom.children
    };
    setDispatcher(instance);
    const newVDom = instance._update();

    return diff(dom, newVDom, parent);
  }

  return dom;
}

function diffAttributes(dom: ReactVDOM, vdom: ReactElement) {
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
