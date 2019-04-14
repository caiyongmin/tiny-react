import { ComponentType, ComponentProps, ComponentElement } from './../../typings/index';

function createElement(
  type: ComponentType,
  props: ComponentProps,
  ...children: ComponentElement[]
) {
  return {
    type,
    props: props || {},
    children
  };
}

export default createElement;
