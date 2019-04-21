import { ElementType, ComponentProps, ReactElement } from './../../typings/index';

function createElement(
  type: ElementType,
  props: ComponentProps,
  ...children: ReactElement[]
): ReactElement {
  return {
    type,
    props: props || {},
    children: children || []
  };
}

export default createElement;
