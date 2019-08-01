import { ComponentType, ComponentProps, ReactElement, VNode } from '../../typings/index';

function createElement(
  type: ComponentType,
  props?: ComponentProps<any>,
  ...children: VNode[]
): ReactElement {
  return {
    type,
    props: props || {},
    children: children
  };
}

export default createElement;
