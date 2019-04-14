import { Hooks } from './hooks';
import {
  ReactVDOM,
  ComponentProps,
  ComponentState,
  ComponentHooks,
  ComponentElement,
} from '../../typings/index';

class Component<P = {}, S = {}> {
  private isReactComponent: boolean;
  public hooks: Hooks;
  public __hooks: ComponentHooks;
  public base: null | ReactVDOM;
  public parentNode: null | ReactVDOM;
  public renderVDOM: (props: ComponentProps<P>) => ComponentElement;

  public props: ComponentProps<P>;
  public state: ComponentState<S>;

  constructor(props: P) {
    this.state = {};
    this.props = props || {};

    this.isReactComponent = true;
    this.hooks = new Hooks(this);
    this.__hooks = null;
    this.base = null;
    this.parentNode = null;
    this.renderVDOM = () => null;
  }

  public _render(renderVDOM: any): ComponentElement {
    this.renderVDOM = renderVDOM;
    const vdom = this.renderVDOM(this.props);
    return vdom;
  }

  public _update(): ComponentElement {
    const vdom = this.renderVDOM(this.props);
    return vdom;
  }
}

export default Component;
