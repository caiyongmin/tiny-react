export function isStrOrNum(val: any): boolean {
  return typeof val === 'string' || typeof val === 'number';
}

export function isUnRenderVDom(val: any): boolean {
  return typeof val === 'boolean' || val === 'undefined' || val === null;
}

export function isFunction(val: any): boolean {
  return typeof val === 'function';
}

export function isString(val: any): boolean {
  return typeof val === 'string';
}

export function isSameNodeType(dom: any, vdom: any) {
  // 文本节点
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return dom.nodeType === 3;
  }

  // DOM 节点
  if (typeof vdom.type === 'string') {
    return dom.nodeName.toLowerCase() === vdom.type.toLowerCase();
  }

  // 组件
  return dom && dom.__componentInstance && dom.__componentInstance.renderVDOM === vdom.type;
}
