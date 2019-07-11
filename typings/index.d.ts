import Component from '../src/react/component';

export interface ReactHtmlElement extends HTMLElement {
  __componentInstance?: any;
  __key?: Key;
  __eventListeners?: {
    [key: string]: any
  };
  [key: string]: any;
}

export type Primitive = null | undefined | string | number | boolean | symbol;

export type ReactElement = {
  type: ComponentType,
  props: ComponentProps,
  children: ReactElement[]
};

export type VNode = Primitive | ReactElement;

export type MountElement = Text | HTMLElement;

export type Key = string | number;

export type Props = {
  key?: Key;
  children?: VNode[]
};

export type ComponentProps<P = Props> = Readonly<Props & P>;

export type ComponentState<S = {}> = Readonly<S>;

export type ComponentType = string | Component;

export type ComponentHooks = null | {
  _list: any[],
  _pendingEffects: any[],
};

export type HookStateValue = [any, (action: any) => void];

export type HookState = {
  __componentInstance: Component;
  __value: HookStateValue;
  _effectArgs: any[];
  _effectCallback: () => any;
  _cleanup: () => any;
};
