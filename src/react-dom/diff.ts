import { render, setAttribute } from './render';
import {
  isUnRenderVDom,
  isSameNodeType,
  isString,
  isFunction
} from './utils';
import { setDispatcher } from './../react/index';

export function diff(dom: any, vdom: any, parent?: any): any {
  // console.info('vdom', vdom, typeof vdom);
  if (vdom === 'true') {
    // debugger;
  }
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
    return dom.textContent !== vdom ? replace(document.createTextNode(vdom)) : dom;
  }

  // DOM 节点
  if (typeof vdom === 'object' && isString(vdom.type)) {
    const pool: any = {};
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
      if (instance && instance.componentWillUnmount) {
        instance.componentWillUnmount();
      }
      pool[key].remove();
    }
    diffAttributes(dom, vdom);
    return dom;
  }

  // Component 组件
  if (typeof vdom === 'object' && isFunction(vdom.type)) {
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

function diffAttributes(dom: any, vdom: any) {
  const attrs = dom.attributes;
  const props = vdom.props;

  for (let attr of attrs) {
    const attrName = attr.name === 'class' ? 'className' : attr.name;

    if (!(attrName in props)) {
      dom.removeAttribute(attr.name);
    }
  }

  for (let prop in props) {
    setAttribute(dom, prop, vdom.props[prop]);
  }
}
