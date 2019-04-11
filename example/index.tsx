import React, { useState } from './../src/react';
import ReactDOM from './../src/react-dom';

function Welcome({ name }) {
  return <div>Hello, {name}!</div>;
}

function HooksFunction() {
  const [toggle, setToggle] = useState(false);

  return (
    <div>
      <h1>Title...</h1>
      <Welcome name="tata" />
      <span className="tips" title="haha">
        toggle: {toggle ? 'true' : 'false'}
      </span>
      <br/>
      <button onClick={() => { setToggle(!toggle) }}>button</button>
    </div>
  );
}

ReactDOM.render(
  <HooksFunction />,
  document.getElementById('root')
);
