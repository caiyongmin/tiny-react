import {
  isStrOrNum,
  isUnRenderVDom,
  isFunction,
  isString
} from './utils';
import React, { setDispatcher } from './../react/index';
import { ComponentElement, ComponentProps, Ele, ReactVDOM } from './../../typings/index';

export function render(vdom: ComponentElement, parent?: any): ReactVDOM {
  const mount = parent ? (el: Ele) => parent.appendChild(el) : (el: Ele) => el;

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
    const props: ComponentProps = { ...vdom.props, children: vdom.children };
    const isClassComponent: boolean = !!(type as any).prototype.render;
    const instance = isClassComponent
      ? new (type as any)(props)
      : new React.Component(props);

    const renderVDOM = isClassComponent
      ? (type as any).prototype.render
      : type;

    setDispatcher(instance);

    if (instance && typeof instance.componentWillMount === 'function') {
      instance.componentWillMount();
    }

    const dom = render(instance._render(renderVDOM), parent);

    if (instance && typeof instance.componentDidMount === 'function') {
      instance.componentDidMount();
    }

    instance.base = dom;
    instance.parentNode = parent;
    instance.base.__componentInstance = instance;
    instance.base.__key = props.key;
    return dom;
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
