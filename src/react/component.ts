import { Hooks } from './hooks';

// TODO: need better type
interface Component {
  isReactComponent: boolean;
  state: any;
  props: any;
  renderVDOM: any;
  base: any;
  hooks: any;
  parentNode: any;
}

class Component {
  constructor(props: any) {
    this.isReactComponent = true;

    this.state = null;
    this.props = props || {};
    this.renderVDOM = null;
    this.base = null;
    this.hooks = new Hooks(this);
    this.parentNode = null;
  }

  public _render(renderVDOM: any) {
    this.renderVDOM = renderVDOM;
    const vdom = this.renderVDOM(this.props);
    return vdom;
  }

  public _update() {
    const vdom = this.renderVDOM(this.props);
    return vdom;
  }
}

export default Component;
