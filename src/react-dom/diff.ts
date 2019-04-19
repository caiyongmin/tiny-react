import { render, setAttribute } from './render';
import {
  isUnRenderVDom,
  isSameNodeType,
  isString,
  isFunction
} from './utils';
import { setDispatcher } from './../react/index';
import { invokeCleanup } from './../react/hooks';
import { ComponentElement, ReactVDOM, ReactElement } from '../../typings/index';

export function diff(dom: ReactVDOM, vdom: ComponentElement, parent?: any): ReactVDOM {
  const replace = parent ? (el: any) => (parent.replaceChild(el, dom) && el) : ((el: any) => el);
  // 不能渲染的 vdom 对象，先转成字符串
  vdom = isUnRenderVDom(vdom) ? '' : vdom;

  /* 节点类型不同，节点重新渲染 */
  if (!isSameNodeType(dom, vdom)) {
    const domInstance = dom.__componentInstance;
    if (domInstance && domInstance.__hooks && domInstance.__hooks._list.length) {
      domInstance.__hooks._list.forEach(invokeCleanup);
      domInstance.__hooks._list = [];
    }
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
    [...vdom.children as any].forEach((child, index) => {
      const key = (typeof child === 'object' && child !== null)
        && child.props && child.props.key
        || `__index_${index}`;
      pool[key] ? diff(pool[key], child, dom) : render(child, dom);
      delete pool[key];
    });
    for (const key in pool) {
      const instance = pool[key].__componentInstance;
      if (instance && instance.__hooks && instance.__hooks._list.length) {
        instance.__hooks._list.forEach(invokeCleanup);
        instance.__hooks._list = [];
      }
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
    const nextProps = {
      ...instance.props,
      ...vdom.props,
    };

    // 调用组件的 componentWillReceiveProps 生命周期方法
    if (instance && typeof instance.componentWillReceiveProps === 'function') {
      instance.componentWillReceiveProps(nextProps);
    }

    // 判断是否需要更新组件
    let shouldComponentUpdate = true;
    if (instance && typeof instance.shouldComponentUpdate === 'function') {
      shouldComponentUpdate = instance.shouldComponentUpdate(nextProps, instance.state);
    }
    if (!shouldComponentUpdate) {
      return dom;
    }

    // 调用组件的 componentWillUpdate 生命周期方法
    if (instance && typeof instance.componentWillUpdate === 'function') {
      instance.componentWillUpdate(nextProps, instance.state);
    }

    // 更新组件的 props，组件进行更新操作
    instance.props = Object.assign({}, nextProps);
    setDispatcher(instance);
    const newVDom = instance._update();
    const result = diff(dom, newVDom, parent);

    // 组件更新完，调用组件的 componentDidUpdate 生命周期方法
    if (instance && typeof instance.componentDidUpdate === 'function') {
      instance.componentDidUpdate(instance.props, instance.state);
    }

    return result;
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
