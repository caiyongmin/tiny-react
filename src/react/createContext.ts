import Component from "./component";
import { isFunction } from "./../shared/is";

let id: number = -1;

type Context<T> = {
  ctxId: number;
  _defaultValue: T;
  Provider?: any;
}

export default function createContext<T>(defaultValue: T): Context<T> {
  const ctxId = id + 1;
  let context: Context<T> = {
    ctxId,
    _defaultValue: defaultValue,
  };

  let providerCtx = {
    [ctxId]: null,
  };

  function initProvider(provider: any) {
    const subs: Component[] = [];
    provider.getChildContext = () => {
      providerCtx[ctxId] = provider;
      return providerCtx;
    };
    provider.shouldComponentUpdate = (props: any) => {
      // TODO: forceUpdate all children
      subs.map((component: Component) => {
				if (component.parentNode) {
          provider.props = Object.assign({}, provider.props, props);
          component.forceUpdate();
				}
      });
    };
    provider.sub = (component: Component) => {
      subs.push(component);
      const _WillUnMount = component.componentWillUnmount;
      component.componentWillUnmount = () => {
        subs.slice(subs.indexOf(component), 1);
        if (isFunction(_WillUnMount)) {
          _WillUnMount();
        }
      }
    }
  }

  function Provider(props: any) {
    // TODO: need better typing
    if (!(this).getChildContext) {
      initProvider(this);
    }
    return props.children;
  }
  context.Provider = Provider;

  return context;
}
