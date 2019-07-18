import Component from './component';
import ReactDOM from './../react-dom/index';
import { isFunction } from "./../react-dom/utils";
import { HookState, HookStateValue } from '../../typings/index';

let dispatcher: Hooks;
let afterPaintEffects: Component[] = [];

// TODO: split Hooks method from Hooks
// TODO: need better typing
export class Hooks {
  private currentInstance: Component;
  public currentIndex: number = 0;

  constructor(instance: Component) {
    this.currentInstance = instance;
  }

  public useState(initialState: any): HookStateValue {
    return this.useReducer(invokeOrReturn, initialState);
  }

  public useEffect(callback: () => any, args: any[]): void {
    const hookState = this.getHookState(this.currentIndex++);

    if (argsChanged(hookState._effectArgs, args)) {
      hookState._effectCallback = callback;
      hookState._effectArgs = args;

      if (this.currentInstance.__hooks !== null) {
        this.currentInstance.__hooks._pendingEffects.push(hookState);
      }
      afterPoint(this.currentInstance);
    }
  }

  public useMemo(callback: () => any, args: any[]) {
    const hookState = this.getHookState(this.currentIndex++);

    if (argsChanged(hookState._effectArgs, args)) {
      hookState._effectCallback = callback;
      hookState._effectArgs = args;

      return hookState.__value = callback();
    }

    return hookState.__value;
  }

  public useCallback(callback: () => void, args: any[]) {
    return this.useMemo(() => callback, args);
  }

  public useRef(initialValue: any) {
    return this.useMemo(() => ({ current: initialValue }), []);
  }

  public useContext(context: any) {
    const provider = this.currentInstance.context[context.ctxId];

    if (!provider) {
      return context._defaultValue;
    }

    const hookState = this.getHookState(this.currentIndex++);
    if (hookState.__value == null) {
      hookState.__value = [true, () => true];
      provider.sub(this.currentInstance);
    }

    return provider.props.value;
  }

  public useReducer(reducer: any, initialState: any, init?: (initialState: any) => any): HookStateValue {
    const hookState = this.getHookState(this.currentIndex++);

    if (!hookState.__componentInstance) {
      hookState.__componentInstance = this.currentInstance;
      hookState.__value = [
        init ? init(initialState) : invokeOrReturn(null, initialState),
        (action: any) => {
          const nextValue = reducer(hookState.__value[0], action);
          if (hookState.__value[0] !== nextValue) {
            hookState.__value[0] = nextValue;
            this.updateComponent(hookState, nextValue);
          }
          return nextValue;
        }
      ];
    }

    return hookState.__value;
  }

  private updateComponent(hookState: HookState, nextValue: any) {
    // 重新渲染之前，把索引位置置为初始值 0
    this.currentIndex = 0;
    // 重新渲染之前，设置当前的 dispatcher
    setDispatcher(hookState.__componentInstance);
    // 重新渲染组件
    const { base, props, renderVDOM, parentNode } = hookState.__componentInstance;
    if (base !== null) {
      ReactDOM.diff(base, renderVDOM(props), parentNode);
    }
  }

  private getHookState(index: number): HookState {
    const hooks = this.currentInstance.__hooks
      || (this.currentInstance.__hooks = { _list: [], _pendingEffects: [] });

    if (index >= hooks._list.length) {
      hooks._list.push({});
    }

    return hooks._list[index];
  }
}

function invokeOrReturn(arg: any, f: any) {
  return isFunction(f) ? f(arg) : f;
}

function argsChanged(oldArgs: any[], newArgs: any[]) {
  return !oldArgs || newArgs.some((arg: any, index: number) => arg !== oldArgs[index]);
}

export function invokeCleanup(effect: HookState) {
  if (effect._cleanup) {
    effect._cleanup();
  }
}

export function invokeEffect(effect: HookState) {
  const cleanup = effect._effectCallback();
  if (isFunction(cleanup)) {
    effect._cleanup = cleanup;
  }
}

function handleEffects(effects: HookState[]): any[] {
  effects.forEach(invokeCleanup);  // cleanup before re-running the effect
  effects.forEach(invokeEffect);
  return [];
}

function flushAfterPaintEffects() {
  afterPaintEffects.forEach((component: Component) => {
    component._afterPaintQueued = false;
    if (component !== null && component.__hooks !== null) {
      component.__hooks._pendingEffects = handleEffects(component.__hooks._pendingEffects);
    }
  });
  afterPaintEffects = [];
}

function afterPoint(component: Component) {
  if (!component._afterPaintQueued && afterPaintEffects.push(component) === 1) {
    component._afterPaintQueued = true;
    window.requestAnimationFrame(flushAfterPaintEffects);
  }
}

export function setDispatcher(componentInstance: Component) {
  dispatcher = componentInstance.hooks;
}

export function useState(initialState: any): HookStateValue {
  return dispatcher.useState(initialState);
}

// TODO: need better typing
export function useEffect(callback: () => any, args: any[]): void {
  return dispatcher.useEffect(callback, args);
}

export function useReducer<T>(
  reducer: (state: T, action: { type: string; [key: string]: any }) => T,
  initialState: T,
  init?: (initialState: T) => T
): [T, (action: { type: string; [key: string]: any }) => any] {
  return dispatcher.useReducer(reducer, initialState, init);
}

// TODO: need better typing
export function useMemo(callback: () => any, args: any[]) {
  return dispatcher.useMemo(callback, args);
}

// TODO: need better typing
export function useCallback(callback: any, args: any[]) {
  return dispatcher.useCallback(callback, args);
}

// TODO: need better typing
export function useRef(initialValue: any) {
  return dispatcher.useRef(initialValue);
}

// TODO: need better typing
export function useContext(defaultValue: any) {
  return dispatcher.useContext(defaultValue);
}
