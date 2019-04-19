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

  return <div>Event</div>
}

function Log({ toggle }) {
  useEffect(() => {
    return () => {
      console.info('cleanup Log effect');
    }
  }, [new Date()]);

  return <div>Log</div>;
}

function HooksFunction() {
  const [ toggle, setToggle ] = useState(false);
  const [ toggle1, setToggle1 ] = useState(true);
  const [ toggle2, setToggle2 ] = useState(false);

  return (
    <div>
      <h1>Title...</h1>
      <Welcome name="tata" />
      {
        toggle ? <Event toggle={toggle} /> : <Log toggle={toggle} />
      }
      <br/>
      <p>toggle: {`${toggle}`}</p>
      <p>toggle1: {`${toggle1}`}</p>
      <p>toggle2: {`${toggle2}`}</p>
      <button onClick={() => {
        setToggle(!toggle);
        setToggle1(!toggle1);
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

  componentWillUpdate() {
    console.info('componentWillUpdate');
  }

  componentDidUpdate() {
    console.info('componentDidUpdate');
  }

  onClick = () => {
    this.setState({ x: this.state.x + 1 });
  }

  render() {
    const { x } = this.state;

    return (
      <div>
        {`Todo, x: ${x}`}
        <button onClick={this.onClick}>Add 1</button>
      </div>
    );
  }
}

ReactDOM.render(
  <Todo />,
  document.getElementById('root')
);
