import {
  isStrOrNum,
  isUnRenderVDom,
  isFunction,
  isString,
  isObject,
  isClass,
} from './../shared/is';
import React from './../react/index';
import { VNode, ReactHtmlElement, MountElement } from '../../typings/index';

export function render(vdom: VNode, parent?: ReactHtmlElement | null, context?: any): ReactHtmlElement {
  const mount = parent ? (el: MountElement) => parent.appendChild(el) : (el: any) => el;

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
    if (vdom.children &&  vdom.children.length) {
      for (const child of [...vdom.children]) {
        // TODO: his can create performance issues and possible bugs.
        // For example, the content of the first input would stay reflected in first input after the sort
        render(child, dom, context);
      }
    }
    if (vdom.props) {
      Object.entries(vdom.props).forEach(([key, value]) => {
        setAttribute(dom, key, value);
      });
    }
    return dom;
  }

  // 渲染 React 组件
  if (typeof vdom === 'object' && vdom !== null && isFunction(vdom.type)) {
    const type = vdom.type as any;
    const isClassComponent: boolean = isClass(type);
    let vdomProps = Object.assign({}, vdom.props);
    // TODO: optimization props processing
    if (vdom.children && vdom.children.length) {
      vdomProps = Object.assign({}, vdomProps, { children: vdom.children });
    }
    const instance = isClassComponent
      ? new type(vdomProps, context)  // tips: current type is React.Component
      : new React.Component(vdomProps, context);
    const renderVDOM = isClassComponent
      ? type.prototype.render
      : type;

    return instance._render(renderVDOM, vdom, parent);
  }

  // 渲染数组子节点
  if (Array.isArray(vdom)) {
    return vdom.map(item => render(item, parent, context)) as any;
  }

  throw new Error(`unkown vdom type: ${String(vdom)}`);
}

export function setAttribute(dom: ReactHtmlElement, key: string, value: any) {
  // 事件属性
  if (key.startsWith('on') && isFunction(value)) {
    let eventType = key.slice(2).toLocaleLowerCase();
    // 使用 addEventListener 方法来监听 input 输入框的值是否发生改变的事件类型是 'input'
    if (dom.tagName.toLocaleLowerCase() === 'input' && eventType === 'change') {
      eventType = 'input';
    }
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
  else if (key === 'ref') {
    if (isFunction(value)) {  // ref 值是函数的情况，调用这个 value 函数，参数为 dom
      value(dom);
    }
    else if (isObject(value)) {  // ref 值是对象，赋予它的 current 属性值为 dom
      value.current = dom;
    }
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
