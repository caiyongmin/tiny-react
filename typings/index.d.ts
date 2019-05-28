import Component from '../src/react/component';

export interface ReactVDOM extends HTMLElement {
  __componentInstance?: any;
  __key?: Key;
  __eventListeners?: {
    [key: string]: any
  };
}

export type Ele = Text | HTMLElement;

export type ReactVNode = null | ReactVDOM;

export type Primitive = null | undefined | string | number | boolean | symbol;

export type ReactElement = {
  type: ElementType,
  props: ComponentProps,
  children: ReactElement[]
};

export type ComponentElement = Primitive | ReactElement;

export type Key = string | number;

export type Props = {
  key?: Key;
  children?: ComponentElement[]
};

export type ComponentProps<P = Props> = Readonly<Props & P>;

export type ComponentState<S = {}> = Readonly<S>;

export type ElementType = string | Component;

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
