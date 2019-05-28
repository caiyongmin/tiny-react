const setStateQueue: any[] = [];
const renderQueue: any[] = [];

export default function setState(stateUpdater: any, component: any) {
  if (setStateQueue.length === 0) {
    defer(flush);
  }

  setStateQueue.push({
    stateUpdater,
    component
  });

  if (!renderQueue.some(item => item === component)) {
    renderQueue.push(component);
  }
}

function defer(fn: () => void): void {
  window.requestAnimationFrame(fn);
}

function flush(): void {
  let item, component;

  while (item = setStateQueue.shift()) {
    const { stateUpdater, component } = item;
    component.prevState = Object.assign({}, component.state);
    const updateState = typeof stateUpdater === 'function'
      ? stateUpdater(component.prevState, component.props)
      : stateUpdater;
    component.nextState = Object.assign({}, component.state, updateState);
  }

  while (component = renderQueue.shift()) {
    const isUpdateState: boolean = true;
    component._update(isUpdateState);
  }
}
