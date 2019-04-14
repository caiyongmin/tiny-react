import Component from './component';
import ReactDOM from './../react-dom/index';
import { HookState, HookStateValue } from './../../typings/index';

let dispatcher: Hooks;

export class Hooks {
  private currentIndex: number = 0;
  private currentInstance: Component;

  constructor(instance: Component) {
    this.currentInstance = instance;
  }

  public useState(initialState: any): HookStateValue {
    return this.useReducer(invokeOrReturn, initialState);
  }

  private useReducer(reducer: any, initialState: any, init?: (initialState: any) => any): HookStateValue {
    const hookState = this.getHookState(this.currentIndex++);

    if (!hookState.__componentInstance) {
      hookState.__componentInstance = this.currentInstance;
      hookState.__value = [
        init ? init(initialState) : invokeOrReturn(null, initialState),
        (action: any) => {
          const nextValue = reducer(hookState.__value[0], action);
          if (hookState.__value[0] !== nextValue) {
            hookState.__value[0] = nextValue;
            this.currentIndex = 0;  // 重新渲染之前，把索引位置置为初始值 0
            setDispatcher(hookState.__componentInstance);  // 重新渲染之前，设置当前的 dispatcher
            // 重新渲染组件
            const { base, props, renderVDOM, parentNode } = hookState.__componentInstance;
            const newVDOM = renderVDOM(props);
            ReactDOM.diff(base as any, newVDOM, parentNode as any);
          }
          return nextValue;
        }
      ];
    }

    return hookState.__value;
  }

  private getHookState(index: number): HookState {
    const hooks = this.currentInstance.__hooks
      || (this.currentInstance.__hooks = { _list: [] });

    if (index >= hooks._list.length) {
      hooks._list.push({});
    }

    return hooks._list[index];
  }
}

function invokeOrReturn(arg: any, f: any) {
  return typeof f === 'function' ? f(arg) : f;
}

export function setDispatcher(componentInstance: Component) {
  dispatcher = componentInstance.hooks;
}

export function useState(initialState: any): HookStateValue {
  return dispatcher.useState(initialState);
}
