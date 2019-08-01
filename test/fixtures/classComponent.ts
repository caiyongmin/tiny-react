import { React } from './../../src';

export const DemoComponentVNode = React.createElement(
  class Demo extends React.Component<{}, { count: number }> {
    constructor(props: any) {
      super(props);

      this.state = {
        count: 0,
      };
    }

    handleClick = () => {
      this.setState({
        count: this.state.count + 1,
      });
    }

    handleStateUpdater = () => {
      this.setState((prevState) => {
        if (!prevState) {
          return { ...this.state };
        }
        const newState = {
          ...this.state,
          count: prevState.count + 1,
        }
        return newState;
      });
    }

    render() {
      const { count } = this.state;

      return React.createElement(
        "div",
        {},
        React.createElement("button", { id: 'add', onClick: this.handleClick }, "addCount"),
        React.createElement("button", { id: 'state-updater', onClick: this.handleStateUpdater }, "stateUpdater"),
        React.createElement("span", { id: 'result' }, count),
      )
    }
  }
);
