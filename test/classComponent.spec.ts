import { createRoot, deleteRoot, sleep } from './utils';
import { ReactDOM, React } from './../src';
import { DemoComponentVNode } from './fixtures/classComponent';

let lifeCycleCall = '';
const TriggerComponent = class Trigger extends React.Component<{ count: number }, { num: number }> {
  constructor(props: { count: number }) {
    super(props);

    this.state = {
      num: 1,
    };
  }

  componentWillMount() {
    lifeCycleCall += 'componentWillMount;';
  }

  componentDidMount() {
    lifeCycleCall += 'componentDidMount;';
  }

  componentWillReceiveProps() {
    lifeCycleCall += 'componentWillReceiveProps;';
  }

  shouldComponentUpdate() {
    lifeCycleCall += 'shouldComponentUpdate;';
    return true;  // always return true, to going through an update process
  }

  componentWillUpdate() {
    lifeCycleCall += 'componentWillUpdate;';
  }

  componentDidUpdate() {
    lifeCycleCall += 'componentDidUpdate;';
  }

  componentWillUnmount() {
    lifeCycleCall += 'componentWillUnmount;';
  }

  handleAddNum = () => {
    this.setState({
      num: this.state.num + 1,
    });
  }

  render() {
    lifeCycleCall += 'render;';
    return React.createElement(
      "div",
      {},
      React.createElement("button", { id: 'num', onClick: this.handleAddNum }, "addNum"),
      React.createElement("button", { id: 'force-update', onClick: () => this.forceUpdate() }, "forceUpdate"),
      React.createElement("span", { id: 'date' }, +new Date()),
      React.createElement("span", {}, this.props.count),
    )
  }
};

// 父组件，内含类型为 classComponent 的子组件
// 父组件主要用来为子组件提供需要的 props 参数
const VNode = React.createElement(
  class Demo extends React.Component<{}, { count: number, toggle: boolean }> {
    constructor(props: any) {
      super(props);

      this.state = {
        count: 0,
        toggle: false,
      };
    }

    handleAdd = () => {
      this.setState({
        count: this.state.count + 1,
      });
    }

    handleToggle = () => {
      this.setState({
        toggle: !this.state.toggle,
      });
    }

    render() {
      return React.createElement(
        'div',
        {},
        React.createElement("button", { id: 'add', onClick: this.handleAdd }, "addCount"),
        React.createElement("button", { id: 'toggle', onClick: this.handleToggle }, "toggle"),
        this.state.toggle
        ? React.createElement('span', {}, String(this.state.toggle))
        : React.createElement(
          // 类型为 classComponent 的子组件
          TriggerComponent,
          { id: 'result', count: this.state.count, }
        )
      )
    }
  }
);

describe('class component', () => {
  let root: HTMLDivElement;

  beforeEach(() => {
    root = createRoot();
  });

  afterEach(() => {
    deleteRoot(root);
  });

  it('should render correct DOM', () => {
    ReactDOM.render(DemoComponentVNode, root);
    expect(root).toMatchSnapshot();
  });

  it('should render correct DOM after virtual dom diff', async () => {
    ReactDOM.render(DemoComponentVNode, root);
    const addButton = root.querySelector('#add') as HTMLButtonElement;
    const result = root.querySelector('#result') as HTMLSpanElement;
    expect(result.innerHTML).toBe('0');
    addButton.click();
    await sleep(50);
    expect(result.innerHTML).toBe("1");
  });

  it('should setState is defer', async () => {
    ReactDOM.render(DemoComponentVNode, root);
    const addButton = root.querySelector('#add') as HTMLButtonElement;
    const result = root.querySelector('#result') as HTMLSpanElement;
    expect(result.innerHTML).toBe('0');
    addButton.click();  // want add 1
    addButton.click();  // want add 1
    addButton.click();  // want add 1
    expect(result.innerHTML).toBe('0');  // but result value still 0
    await sleep(50);
    expect(result.innerHTML).toBe('1');  // state value is 1
  });

  it('should work about setState with stateUpdater', async () => {
    ReactDOM.render(DemoComponentVNode, root);
    const stateUpdaterButton = root.querySelector('#state-updater') as HTMLButtonElement;
    const result = root.querySelector('#result') as HTMLSpanElement;
    expect(result.innerHTML).toBe('0');
    stateUpdaterButton.click();  // want add 1
    stateUpdaterButton.click();  // want add 1
    stateUpdaterButton.click();  // want add 1
    expect(result.innerHTML).toBe('0');
    await sleep(50);
    expect(result.innerHTML).toBe('3');
    expect(0).toBe(0);
  });

  it('should call the correct life cycle function', async () => {
    ReactDOM.render(VNode, root);
    const addButton = root.querySelector('#add') as HTMLButtonElement;
    const forceUpdateButton = root.querySelector('#force-update') as HTMLButtonElement;
    const toggleButton = root.querySelector('#toggle') as HTMLButtonElement;
    const numButton = root.querySelector('#num') as HTMLSpanElement;

    // mounting
    expect(lifeCycleCall).toBe(''
      + 'componentWillMount;'
      + 'render;'
      + 'componentDidMount;'
    );

    // updating from new props
    lifeCycleCall = '';
    addButton.click();
    await sleep(50);
    expect(lifeCycleCall).toBe(''
      + 'componentWillReceiveProps;'
      + 'shouldComponentUpdate;'
      + 'componentWillUpdate;'
      + 'render;'
      + 'componentDidUpdate;'
    );

    // updating from new state
    lifeCycleCall = '';
    numButton.click();
    await sleep(50);
    expect(lifeCycleCall).toBe(''
      + 'shouldComponentUpdate;'
      + 'componentWillUpdate;'
      + 'render;'
      + 'componentDidUpdate;'
    );

    // updating from forceUpdate
    lifeCycleCall = '';
    forceUpdateButton.click();
    await sleep(50);
    expect(lifeCycleCall).toBe(''
      + 'componentWillUpdate;'
      + 'render;'
      + 'componentDidUpdate;'
    );

    // unmounting
    lifeCycleCall = '';
    toggleButton.click();
    await sleep(50);
    expect(lifeCycleCall).toBe(''
      + 'componentWillUnmount;'
    );
  });
});
