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

      component.prevState = Object.assign({}, component.state);
      const updateState = typeof update === 'function'
        ? update(component.prevState, component.props)
        : update;
      component.nextState = Object.assign({}, component.state, updateState);
    }

    while(component = renderQueue.shift()) {
      const isUpdateState: boolean = true;
      component._update(isUpdateState);
    }
}
