import ReactDOM from './../react-dom/index';

let dispatcher: any;

export class Hooks {
  private currentIndex: number;
  private currentComponentInstance: any;

  constructor(instance: any) {
    this.currentIndex = 0;
    this.currentComponentInstance = instance;
  }

  public useState(initialState: any) {
    return this.useReducer(invokeOrReturn, initialState);
  }

  private useReducer(reducer: any, initialState: any, init?: any) {
    const hookState = this.getHookState(this.currentIndex++);

    if (!hookState.__componentInstance) {
      hookState.__componentInstance = this.currentComponentInstance;
      hookState.__value = [
        init ? init(initialState) : invokeOrReturn(null, initialState),
        (action: any) => {
          const nextValue = reducer(hookState.__value[0], action);
          if (hookState.__value[0] !== nextValue) {
            hookState.__value[0] = nextValue;
            // 重新渲染之前，把索引位置置为初始值 0
            this.currentIndex = 0;
            // 重新渲染之前，设置当前的 dispatcher
            setDispatcher(hookState.__componentInstance);
            // 重新渲染组件
            const { base, props, renderVDOM, parentNode } = hookState.__componentInstance;
            const newVDOM = renderVDOM(props);
            ReactDOM.diff(base, newVDOM, parentNode);
          }
        }
      ];
    }

    return hookState.__value;
  }

  private getHookState(index: number) {
    const hooks = this.currentComponentInstance.__hooks
      || (this.currentComponentInstance.__hooks = { _list: []});

    if (index >= hooks._list.length) {
      hooks._list.push({});
    }

    return hooks._list[index];
  }
}

function invokeOrReturn(arg: any, f: any) {
  return typeof f === 'function' ? f(arg) : f;
}

export function setDispatcher(componentInstance: any) {
  dispatcher = componentInstance.hooks;
}

export function useState(initialState: any) {
  return dispatcher.useState(initialState);
}
