import { ComponentElement } from "../../typings/index";

export function isStrOrNum(val: any): boolean {
  return typeof val === 'string' || typeof val === 'number';
}

export function isUnRenderVDom(val: any): boolean {
  return typeof val === 'boolean' || val === 'undefined' || val === null;
}

export function isObject(val: any): boolean {
  return typeof val === 'object' && val !== null;
}

export function isFunction(val: any): boolean {
  return typeof val === 'function';
}

export function isString(val: any): boolean {
  return typeof val === 'string';
}

export function isSameNodeType(dom: any, vdom: ComponentElement): boolean {
  // 文本节点
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return dom.nodeType === 3;
  }

  // DOM 节点
  if (typeof vdom === 'object' && vdom !== null && typeof vdom.type === 'string') {
    return dom.nodeName.toLowerCase() === vdom.type.toLowerCase();
  }

  // 组件
  if (dom && dom.__componentInstance && typeof vdom === 'object' && vdom !== null && vdom.type) {
    return dom.__componentInstance.renderVDOM === vdom.type;
  }

  return false;
}

export function shallowCompareObject(
  obj: { [ key: string ]: any },
  compareObj: { [ key: string ]: any },
) {
  if (!isObject(obj) || !isObject(compareObj)) {
    return false;
  }

  const objKeys = Object.keys(obj);
  const compareObjKeys = Object.keys(compareObj);

  if (objKeys.length !== compareObjKeys.length) {
    return false;
  }

  let index = objKeys.length;
  while (index--) {
    const key = objKeys[index];

    if (
      !Object.hasOwnProperty.call(compareObj, key)
      || compareObj[key] !== obj[key]
    ) {
      return false;
    }
  }

  return true;
}
