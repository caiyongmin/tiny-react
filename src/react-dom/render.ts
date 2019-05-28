import {
  isStrOrNum,
  isUnRenderVDom,
  isFunction,
  isString
} from './utils';
import React from './../react/index';
import { ComponentElement, ReactVDOM } from '../../typings/index';

export function render(vdom: ComponentElement, parent?: ReactVDOM): ReactVDOM {
  const mount = parent ? (el: any) => parent.appendChild(el) : (el: any) => el;

  // 渲染数字和字符串
  if (isStrOrNum(vdom)) {
    return mount(document.createTextNode(String(vdom)));
  }

  // 渲染 true、false、undefined、null
  if (isUnRenderVDom(vdom)) {
    return mount(document.createTextNode(''));
  }

  // 渲染原生 DOM
  if (typeof vdom === 'object' && vdom !== null && isString(vdom.type)) {
    const dom = mount(document.createElement(String(vdom.type)));
    for (const child of [...vdom.children]) {
      render(child, dom);
    }
    Object.entries(vdom.props).forEach(([key, value]) => {
      setAttribute(dom, key, value);
    });
    return dom;
  }

  // 渲染 React 组件
  if (typeof vdom === 'object' && vdom !== null && isFunction(vdom.type)) {
    const type = vdom.type;
    const isClassComponent: boolean = !!(type as any).prototype.render;
    const instance = isClassComponent
      ? new (type as any)(vdom.props)
      : new React.Component(vdom.props);
    const renderVDOM = isClassComponent
      ? (type as any).prototype.render
      : type;

    return instance._render(renderVDOM, vdom, parent);
  }

  // 渲染数组子节点
  if (Array.isArray(vdom)) {
    return vdom.map(item => render(item, parent)) as any;
  }

  throw new Error(`unkown vdom type: ${String(vdom)}`);
}

export function setAttribute(dom: ReactVDOM, key: string, value: any) {
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
    (dom as any)[key] = value;
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
