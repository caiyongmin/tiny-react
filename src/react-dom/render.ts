import {
  isStrOrNum,
  isUnRenderVDom,
  isFunction,
  isString
} from './utils';
import React, { setDispatcher } from './../react/index';

export function render(vdom: any, parent?: any): any {
  const mount = parent ? (el: any) => parent.appendChild(el) : (el: any) => el;

  // 渲染数字和字符串
  if (isStrOrNum(vdom)) {
    return mount(document.createTextNode(vdom));
  }

  // 渲染 true、false、undefined、null
  if (isUnRenderVDom(vdom)) {
    return mount(document.createTextNode(''));
  }

  // 渲染原生 DOM
  if (typeof vdom === 'object' && isString(vdom.type)) {
    const dom = mount(document.createElement(vdom.type));
    for (const child of [...vdom.children]) {
      render(child, dom);
    }
    Object.entries(vdom.props).forEach(([key, value]) => {
      setAttribute(dom, key, value);
    });
    return dom;
  }

  // 渲染 React 组件
  if (typeof vdom === 'object' && isFunction(vdom.type)) {
    const props = { ...vdom.props, children: vdom.children };
    const instance = new React.Component(props);
    setDispatcher(instance);
    const dom = render(instance._render(vdom.type), parent);

    instance.base = dom;
    instance.parentNode = parent;
    instance.base.__componentInstance = instance;
    instance.base.__key = props.key;

    return dom;
  }

  throw new Error(`unkown vdom type: ${vdom.type}`);
}

export function setAttribute(dom: any, key: string, value: any) {
  // 事件属性
  if (key.startsWith('on') && isFunction(value)) {
    const eventType = key.slice(2).toLocaleLowerCase();
    dom.__eventListeners = dom.__eventListeners || {};
    if (dom.__eventListeners[eventType]) {
      dom.removeEventListener(eventType, dom.__eventListeners[eventType]);
    }
    dom.__eventListeners[eventType] = value;
    dom.addEventListener(eventType, value);
  }
  else if (key === 'checked' || key === 'value' || key === 'className') {
    dom[key] = value;
  }
  else if (key === 'ref' && typeof value === 'function') {
    value(dom);
  }
  else if (key === 'key') {
    dom.__key = value;
  }
  else if (key === 'style') {
    Object.assign(dom.style, value);
  }
  else if (key === 'children') {

  }
  else {
    dom.setAttribute(key, value);
  }
}
