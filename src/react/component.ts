import { Hooks, setDispatcher, invokeCleanup } from './hooks';
import setState from './setState';
import ReactDOM from '../react-dom/index';
import { shallowCompareObject, isFunction } from './../react-dom/utils';
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

  constructor(props: ComponentProps<P>) {
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
    this.renderVDOM = () => ({ type: '', props: {}, children: [] });
    this._afterPaintQueued = false;
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
    const dom = ReactDOM.render(this.renderVDOM(this.props), parent);

    if (isFunction(this.componentDidMount)) {
      this.componentDidMount();
    }

    this.base = dom;
    this.parentNode = parent;
    this.base.__componentInstance = this;
    this.base.__key = vdom.props.key;

    return dom;
  }

  public _update(isUpdateState?: boolean): null | ReactHtmlElement {
    if (this.base === null) {
      return null;
    }

    const dom = this.base;
    this.nextProps = Object.assign({}, dom.__componentInstance.props, this.props);
    this.nextState = this.nextState  || Object.assign({}, this.state);

    // 如果是更新 state 更新渲染时，不执行 componentWillReceiveProps 生命周期方法
    if (!isUpdateState) {
      // 调用组件的 componentWillReceiveProps 生命周期方法
      if (isFunction(this.componentWillReceiveProps)) {
        this.componentWillReceiveProps(this.nextProps);
      }
    }

    // 判断是否需要更新组件
    let shouldComponentUpdate = true;
    if (isFunction(this.shouldComponentUpdate)) {
      shouldComponentUpdate = this.shouldComponentUpdate(this.nextProps, this.nextState);
    }
    if (!shouldComponentUpdate) {
      return dom;
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
    const vdom = this.renderVDOM(this.props);
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

  // 调用 useEffect hook 返回的 cleanup 方法
  public cleanup() {
    if (this.__hooks && this.__hooks._list && this.__hooks._list.length) {
      this.__hooks._list.forEach(invokeCleanup);
      this.__hooks._list = [];
    }
  }

  public setState(
    stateUpdater: (
      (state?: ComponentState<S>, props?: ComponentProps<P>) => ComponentState<S>
    ) | Partial<ComponentState<S>>
  ) {
    setState(stateUpdater, this);
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
}

export default Component;
