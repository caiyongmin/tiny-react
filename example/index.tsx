import React, { useState, useEffect } from './../src/react';
import ReactDOM from './../src/react-dom';

function Welcome({ name }) {
  return <div>Hello, {name}!</div>;
}

function Event({ toggle }) {
  useEffect(() => {
    return () => {
      console.info('cleanup Event effect');
    }
  }, [new Date()]);

  return <div>Event: {`${toggle}`}</div>
}

function Log({ toggle }) {
  useEffect(() => {
    return () => {
      console.info('cleanup Log effect');
    }
  }, [new Date()]);

  return <div>Log: {`${toggle}`}</div>;
}

function HooksFunction() {
  const [ toggle, setToggle ] = useState(false);
  const [ toggle1, setToggle1 ] = useState(new Date());
  const [ toggle2, setToggle2 ] = useState(false);

  return (
    <div>
      <Welcome name="tata" />
      {
        toggle ? <Event toggle={toggle1} /> : <Log toggle={toggle1} />
      }
      <br/>
      <p>toggle: {`${toggle}`}</p>
      <p>toggle1: {`${toggle1}`}</p>
      <p>toggle2: {`${toggle2}`}</p>
      <button onClick={() => {
        setToggle(!toggle);
        setToggle1(new Date());
        setToggle2(!toggle2);
      }}>button</button>
    </div>
  );
}

class Todo extends React.Component<any, { x: number }> {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
    };
  }

  componentWillMount() {
    console.info('componentWillMount');
  }

  componentDidMount() {
    console.info('componentDidMount');
  }

  componentWillReceiveProps() {
    console.info('componentWillReceiveProps');
  }

  componentWillUpdate() {
    console.info('componentWillUpdate');
  }

  componentDidUpdate() {
    console.info('componentDidUpdate');
  }

  onClick = () => {
    for (let i = 0; i < 100; i++) {
      const { x } = this.state as any;
      this.setState({ x: x + 1 });
    }
  }

  render() {
    const { x } = this.state as any;

    return (
      <div>
        {`Todo, x: ${x}`}
        <button onClick={this.onClick}>Add 1</button>
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <h1>Example</h1>
    <HooksFunction />
    <hr/>
    <Todo />
  </div>,
  document.getElementById('root')
);
