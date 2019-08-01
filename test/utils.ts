import {
  React,
  ReactDOM,
  useState,
} from './../src';
import { ComponentType, VNode } from './../typings';

/**
 * 创建一个可渲染的节点
 */
export function createRoot(): HTMLDivElement {
	const root = document.createElement('div');
	root.id = 'root';
	(document.body || document.documentElement).appendChild(root);
	return root;
}

/**
 * 删除这个 root 节点
 */
export function deleteRoot(root: HTMLDivElement) {
	if (
    root
    && root.parentNode
    && typeof root.parentNode.removeChild === 'function'
  ) {
		root.parentNode.removeChild(root);
	}
}

export function createVNode(
  type: ComponentType,
  props: null | { [key: string]: any; },
  ...children: any[]
) {
  return {
    type,
    props,
    children
  }
}

export function createKeyboardEvent(
  name: string,
  key?: string,
  altKey?: boolean,
  ctrlKey?: boolean,
  shiftKey?: boolean,
  metaKey?: boolean
) {
  var e = new Event(name) as any;
  e.key = key || '';
  e.keyCode = e.key.charCodeAt(0);
  e.which = e.keyCode || false;
  e.altKey = altKey || false;
  e.ctrlKey = ctrlKey || false;
  e.shiftKey = shiftKey || false;
  e.metaKey =  metaKey || false;
  return e;
}

export function sleep(ms = 0, needReject = false) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      needReject ? reject(ms) : resolve(ms);
    }, ms);
  });
}
