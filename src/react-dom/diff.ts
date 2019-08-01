import { render, setAttribute } from './render';
import {
  isUnRenderVDom,
  isSameNodeType,
  isString,
  isFunction
} from './utils';
import { VNode, ReactHtmlElement, ReactElement, MountElement } from '../../typings/index';

export function diff(
  dom: ReactHtmlElement,
  vdom: VNode,
  parent?: ReactHtmlElement | null,
): ReactHtmlElement {
  // console.info('diff vdom', vdom);
  const replace = parent ? (el: MountElement) => {
    return parent.replaceChild(el, dom);
  } : ((el: any) => el);
  // 不能渲染的 vdom 对象，先转成空字符串
  vdom = isUnRenderVDom(vdom) ? '' : vdom;
  // 把数字先转成字符串
  vdom = typeof vdom === 'number' ? String(vdom) : vdom;

  // 节点类型不同或者强制渲染时，节点重新渲染
  if (!isSameNodeType(dom, vdom)) {
    // console.info('diff !isSameNodeType');
    if (dom.__componentInstance && dom.__componentInstance.componentWillUnmount) {
      dom.__componentInstance.componentWillUnmount();
    }
    if (dom.__componentInstance && dom.__componentInstance.cleanup) {
      dom.__componentInstance.cleanup();
    }
    const el = render(vdom, parent);
    return replace(el);
  }

  // 节点类型相同，做具体的 diff 操作
  // 文本节点
  if (isString(vdom)) {
    // console.info('diff isString');
    return dom.textContent !== vdom ? replace(document.createTextNode(String(vdom))) : dom;
  }

  // DOM 节点
  if (typeof vdom === 'object' && vdom !== null && isString(vdom.type)) {
    // console.info('diff DOM');
    return diffNativeDom(dom, vdom);
  }

  // Component 组件
  if (typeof vdom === 'object' && vdom !== null && isFunction(vdom.type)) {
    // console.info('diff Component');
    const instance = dom.__componentInstance;
    const isUpdateState = false;
    instance.nextProps = vdom.props;
    return instance._update(isUpdateState);
  }

  throw new Error(`unkown vdom type: ${String(vdom)}`);
}

function diffNativeDom(dom: any, vdom: ReactElement) {
  const pool: {
    [key: string]: ReactHtmlElement;
  } = {};

  [...dom.childNodes].forEach((child, index) => {
    const key = child.__key || `__index_${index}`;
    pool[key] = child;
  });

  if (vdom.children && vdom.children.length) {
    [...vdom.children].forEach((child: any, index: number) => {
      const key = child.props && child.props.key || `__index_${index}`;
      pool[key] ? diff(pool[key], child, dom) : render(child, dom);
      delete pool[key];
    });
  }

  for (const key in pool) {
    const instance = pool[key].__componentInstance;
    if (instance && instance.cleanup) {
      instance.cleanup();
    }
    if (instance && instance.componentWillUnmount) {
      instance.componentWillUnmount();
    }
    pool[key].remove();
  }

  diffAttributes(dom, vdom);

  return dom;
}

function diffAttributes(dom: ReactHtmlElement, vdom: ReactElement) {
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
