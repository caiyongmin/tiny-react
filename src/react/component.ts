import { Hooks, setDispatcher, invokeCleanup } from './hooks';
import setState from './setState';
import ReactDOM from '../react-dom/index';
import { isFunction } from './../shared/is';
import { shallowCompareObject } from './../shared/shallowCompare';
import {
  ReactHtmlElement,
  ComponentProps,
  ComponentState,
  ComponentHooks,
  ReactElement,
} from '../../typings/index';

class Component<P = {}, S = {}> {
  private isReactComponent: boolean;
  public hooks: Hooks;
  public __hooks: ComponentHooks;
  public base: null | ReactHtmlElement;
  public parentNode: null | ReactHtmlElement;
  public renderVDOM: (props: ComponentProps<P>) => ReactElement;
  public _afterPaintQueued: boolean;

  public props: ComponentProps<P>;
  public nextProps: ComponentProps<P>;
  public prevProps: ComponentProps<P>;
  public state: ComponentState<S>;
  public nextState: null | ComponentState<S>;
  public prevState: null | ComponentState<S>;
  public context: any;

  constructor(props: ComponentProps<P>, context?: any) {
    this.state = {} as ComponentState<S>;
    this.nextState = null;
    this.prevState = null;
    this.props = props || {};
    this.nextProps = this.props;
    this.prevProps = this.props;

    this.isReactComponent = true;
    this.hooks = new Hooks(this as Component<any, any>);
    this.__hooks = null;
    this.base = null;
    this.parentNode = null;
    // TODO: no running code, delete it
    this.renderVDOM = () => ({ type: '', props: {}, children: [] });
    this._afterPaintQueued = false;
    this.context = context;
  }

  public _render(
    renderVDOM: (props: ComponentProps<P>) => ReactElement,
    vdom: ReactElement,
    parent: ReactHtmlElement
  ): null | ReactHtmlElement {
    if (isFunction(this.componentWillMount)) {
      this.componentWillMount();
    }

    // 记录下 renderVDOM 函数
    this.renderVDOM = renderVDOM;
    this.setDispatcher();
    let vDomElement = this.renderVDOM(this.props);
    if ((this as any).getChildContext) {
      this.context = Object.assign({}, this.context, (this as any).getChildContext());
    }
    // TODO: optimization render vdom of array type
    if (Array.isArray(vDomElement)) {
      vDomElement = {
        type: 'div',
        props: {},
        children: vDomElement,
      };
    }
    const dom = ReactDOM.render(vDomElement, parent, this.context);

    if (isFunction(this.componentDidMount)) {
      this.componentDidMount();
    }

    this.base = dom;
    this.parentNode = parent;
    this.base.__componentInstance = this;
    this.base.__key = vdom.props.key;

    return dom;
  }

  public _update(isUpdateState?: boolean, isForceUpdate?: boolean): null | ReactHtmlElement {
    // TODO: no running code, delete it
    if (this.base === null) {
      return null;
    }

    const dom = this.base;
    // TODO: may not use nextProps params, need use this.nextProps
    this.nextProps = Object.assign({}, dom.__componentInstance.props, this.nextProps);
    this.nextState = this.nextState || Object.assign({}, this.state);

    // 如果不是 forceUpdate，不执行 componentWillReceiveProps 和 shouldComponentUpdate 生命周期方法
    if (!isForceUpdate) {
      // 如果是由更新 state 来更新渲染时，不执行 componentWillReceiveProps 生命周期方法
      if (!isUpdateState) {
        // 调用组件的 componentWillReceiveProps 生命周期方法
        if (isFunction(this.componentWillReceiveProps)) {
          this.componentWillReceiveProps(this.nextProps);
        }
      }
      // 判断是否需要更新组件，默认为 true
      let shouldUpdate = true;
      if (isFunction(this.shouldComponentUpdate)) {
        shouldUpdate = this.shouldComponentUpdate(this.nextProps, this.nextState);
      }
      // 不需要更新渲染
      if (!shouldUpdate) {
        return dom;
      }
    }

    // 执行组件的 componentWillUpdate 生命周期方法
    if (isFunction(this.componentWillUpdate)) {
      this.componentWillUpdate(this.nextProps, this.nextState);
    }

    // 记录 prevProps 和 prevState
    this.prevProps = Object.assign({}, this.props);
    this.prevState = Object.assign({}, this.state);
    // 设置组件新的 props 和 state 的值，开始更新渲染
    this.props = Object.assign({}, this.nextProps);
    this.state = Object.assign({}, this.nextState);
    this.setDispatcher();
    this.resetHooksIndex();
    let vdom = this.renderVDOM(this.props);
    // TODO: optimization render vdom of array type
    if (Array.isArray(vdom)) {
      vdom = {
        type: 'div',
        props: {},
        children: vdom,
      };
    }
    const result = ReactDOM.diff(dom, vdom, this.parentNode);

    // 组件更新完，执行组件的 componentDidUpdate 生命周期方法
    if (isFunction(this.componentDidUpdate)) {
      this.componentDidUpdate(this.prevProps, this.prevState);
    }

    return result;
  }

  private setDispatcher() {
    setDispatcher(this as Component<any, any>);
  }

  private resetHooksIndex() {
    this.hooks.currentIndex = 0;
  }

  // 调用 useEffect hook 返回的 cleanup 方法
  public cleanup() {
    if (this.__hooks && this.__hooks._list && this.__hooks._list.length) {
      this.__hooks._list.forEach(invokeCleanup);
      this.__hooks._list = [];
    }
  }

  public setState(
    stateUpdater: (
      (prevState?: ComponentState<S>, props?: ComponentProps<P>) => ComponentState<S>
    ) | Partial<ComponentState<S>>
  ) {
    setState(stateUpdater, this);
  }

  public forceUpdate(callback?: () => any) {
    this._update(false, true);
    if (callback) {
      callback();
    }
  }

  public componentWillMount?() {}

  public componentDidMount?() {}

  public shouldComponentUpdate?(nextProps: ComponentProps<P>, nextState: ComponentState<S>) {
    return !shallowCompareObject(nextProps, this.props)
      || !shallowCompareObject(nextState, this.state);
  }

  public componentWillReceiveProps?(nextProps: ComponentProps<P>) {}

  public componentWillUpdate?(nextProps: ComponentProps<P>, nextState: ComponentState<S>) {}

  public componentDidUpdate?(prevProps: ComponentProps<P>, prevState: ComponentState<S>) {}

  public componentWillUnmount?() {}
}

export default Component;
