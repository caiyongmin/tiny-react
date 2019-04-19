import ReactDOM from '../react-dom/index';

const setStateQueue: any[] = [];
const renderQueue: any[] = [];

export default function setState(update: any, component: any) {
  if (setStateQueue.length === 0) {
    defer(flush);
  }

  setStateQueue.push({
    update,
    component
  });

  if (!renderQueue.some(item => item === component)) {
    renderQueue.push(component);
  }
}

function defer(fn: () => void) {
  return window.requestAnimationFrame(fn);
}

function flush() {
    let item, component;

    while(item = setStateQueue.shift()) {
      const { update, component } = item;
      if (!component.prevState) {
        component.prevState = Object.assign({}, component.state);
      }
      if ( typeof update === 'function' ) {
        component.nextState = Object.assign({}, component.state, update(component.prevState, component.props));
      } else {
        component.nextState = Object.assign({}, component.state, update);
      }
    }

    while(component = renderQueue.shift()) {
      // 判断组件是否需要更新
      let shouldComponentUpdate = true;
      if (component && typeof component.shouldComponentUpdate === 'function') {
        shouldComponentUpdate = component.shouldComponentUpdate(component.props, component.nextState);
      }
      if (!shouldComponentUpdate) {
        return;
      }

      // 调用组件的 componentWillUpdate 生命周期方法
      if (component && typeof component.componentWillUpdate === 'function') {
        component.componentWillUpdate(component.props, component.nextState);
      }

      component.prevState = Object.assign({}, component.state);
      component.state = Object.assign({}, component.nextState);
      const dom = component.base;
      const vdom = component.renderVDOM();
      const parentNode = component.parentNode;
      ReactDOM.diff(dom, vdom, parentNode);

      // 组件更新完，调用组件的 componentDidUpdate 生命周期方法
      if (component && typeof component.componentDidUpdate === 'function') {
        component.componentDidUpdate(component.props, component.prevState);
      }
    }
}
