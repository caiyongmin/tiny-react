import Component from './../src/react/component';

export interface ReactVDOM extends HTMLElement {
  __componentInstance?: any;
  __key?: Key;
  __eventListeners?: {
    [key: string]: any
  };
}

export type Ele = Text | HTMLElement;

export type ReactNode = null | ReactVDOM;

export type Primitive = null | undefined | string | number | boolean | symbol;

export type ReactElement = {
  type: ComponentType,
  props: ComponentProps,
  children: ComponentElement[]
};

export type ComponentElement = Primitive | ReactElement;

export type Key = string | number;

export type Props = {
  key?: Key;
  children?: ComponentElement[]
};

export type ComponentProps<P = Props> = Props | Readonly<P>;

export type ComponentState<S = {}> = {} | Readonly<S>;

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
