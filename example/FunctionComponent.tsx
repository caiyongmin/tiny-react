import { React, useState } from '../src';

function Event() {
  return <span>Event</span>;
}

function Log() {
  return <span>Log</span>;
}

export default function HooksFunction() {
  const [ toggle, setToggle ] = useState(false);

  return (
    <div>
      <button onClick={() => {
        setToggle(!toggle);
      }}>useState toggle</button>
      &nbsp;&nbsp;
      {toggle ? <Event /> : <Log />}
    </div>
  );
}
