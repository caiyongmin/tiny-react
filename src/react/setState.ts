import { isFunction } from "./../react-dom/utils";
import Component from "./component";
import { ComponentProps, ComponentState } from '../../typings/index';

type StateUpdater = (
  (prevState?: ComponentState<any>, props?: ComponentProps<any>) => ComponentState<any>
) | Partial<ComponentState<any>>

const setStateQueue: {
  stateUpdater: StateUpdater;
  component: Component<any, any>;
}[] = [];
const renderQueue: Component<any, any>[] = [];

export default function setState(stateUpdater: StateUpdater, component: Component<any, any>) {
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
    const updateState = isFunction(stateUpdater)
      ? stateUpdater(component.prevState, component.props)
      : stateUpdater;
    component.nextState = Object.assign({}, component.state, updateState);
  }

  while (component = renderQueue.shift()) {
    const isUpdateState: boolean = true;
    component._update(isUpdateState);
  }
}
