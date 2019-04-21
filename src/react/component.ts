import { Hooks, setDispatcher, invokeCleanup } from './hooks';
import setState from './setState';
import ReactDOM from '../react-dom/index';
import { shallowCompareObject } from './../react-dom/utils';
import {
  ReactVDOM,
  ComponentProps,
  ComponentState,
  ComponentHooks,
  ReactElement,
  ReactVNode,
} from '../../typings/index';

class Component<P = {}, S = {}> {
  private isReactComponent: boolean;
  public hooks: Hooks;
  public __hooks: ComponentHooks;
  public base: ReactVNode;
  public parentNode: ReactVNode;
  public renderVDOM: (props: ComponentProps<P>) => ReactElement;
  public _afterPaintQueued: boolean;

  public props: ComponentProps<P>;
  public nextProps: ComponentProps<P>;
  public prevProps: ComponentProps<P>;
  public state: ComponentState<S>;
  public nextState: null | ComponentState<S>;
  public prevState: null | ComponentState<S>;

  constructor(props: ComponentProps<P>) {
    this.state = {};
    this.nextState = null;
    this.prevState = null;
    this.props = props || {};
    this.nextProps = this.props;
    this.prevProps = this.props;

    this.isReactComponent = true;
    this.hooks = new Hooks(this);
    this.__hooks = null;
    this.base = null;
    this.parentNode = null;
    this.renderVDOM = () => ({ type: '', props: {}, children: [] });
    this._afterPaintQueued = false;
  }

  public _render(
    renderVDOM: (props: ComponentProps<P>) => ReactElement,
    vdom: ReactElement,
    parent: ReactVDOM
  ): ReactVNode {
    if (typeof this.componentWillMount === 'function') {
      this.componentWillMount();
    }

    // 记录下 renderVDOM 函数
    this.renderVDOM = renderVDOM;
    setDispatcher(this);
    const dom = ReactDOM.render(this.renderVDOM(this.props), parent);

    if (typeof this.componentDidMount === 'function') {
      this.componentDidMount();
    }

    this.base = dom;
    this.parentNode = parent;
    this.base.__componentInstance = this;
    this.base.__key = vdom.props.key;

    return dom;
  }

  public _update(isUpdateState?: boolean): ReactVNode {
    if (this.base === null) {
      return null;
    }

    const dom = this.base;
    this.nextProps = Object.assign({}, dom.__componentInstance.props, this.props);
    this.nextState = this.nextState  || Object.assign({}, this.state);

    // 如果是更新 state 更新渲染时，不执行 componentWillReceiveProps 生命周期方法
    if (!isUpdateState) {
      // 调用组件的 componentWillReceiveProps 生命周期方法
      if (typeof this.componentWillReceiveProps === 'function') {
        this.componentWillReceiveProps(this.nextProps);
      }
    }

    // 判断是否需要更新组件
    let shouldComponentUpdate = true;
    if (typeof this.shouldComponentUpdate === 'function') {
      shouldComponentUpdate = this.shouldComponentUpdate(this.nextProps, this.nextState);
    }
    if (!shouldComponentUpdate) {
      return dom;
    }

    // 执行组件的 componentWillUpdate 生命周期方法
    if (typeof this.componentWillUpdate === 'function') {
      this.componentWillUpdate(this.nextProps, this.nextState);
    }

    // 记录 prevProps 和 prevState
    this.prevProps = Object.assign({}, this.props);
    this.prevState = Object.assign({}, this.state);
    // 设置组件新的 props 和 state 的值，开始更新渲染
    this.props = Object.assign({}, this.nextProps);
    this.state = Object.assign({}, this.nextState);
    setDispatcher(this);
    const vdom = this.renderVDOM(this.props);
    const result = ReactDOM.diff(dom, vdom, this.parentNode);

    // 组件更新完，执行组件的 componentDidUpdate 生命周期方法
    if (typeof this.componentDidUpdate === 'function') {
      this.componentDidUpdate(this.prevProps, this.prevState);
    }

    return result;
  }

  // 调用 useEffect hook 返回的 cleanup 方法
  public cleanup() {
    if (this.__hooks && this.__hooks._list && this.__hooks._list.length) {
      this.__hooks._list.forEach(invokeCleanup);
      this.__hooks._list = [];
    }
  }

  public setState(stateUpdater: any) {
    setState(stateUpdater, this);
  }

  public componentWillMount?() {}

  public componentDidMount?() {}

  public shouldComponentUpdate?(nextProps: any, nextState: any) {
    return !shallowCompareObject(nextProps, this.props)
      || !shallowCompareObject(nextState, this.state);
  }

  public componentWillReceiveProps?(nextProps: ComponentProps<P>) {}

  public componentWillUpdate?(nextProps: ComponentProps<P>, nextState: ComponentState<S>) {}

  public componentDidUpdate?(prevProps: ComponentProps<P>, prevState: ComponentState<S>) {}
}

export default Component;
