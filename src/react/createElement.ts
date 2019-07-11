import { ComponentType, ComponentProps, ReactElement } from '../../typings/index';

function createElement(
  type: ComponentType,
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
