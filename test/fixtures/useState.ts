import { React, useState } from './../../src';

export const useStateVNode = React.createElement(
  function () {
    const initialValue = 0;
    const [ count, setCount ] = useState(initialValue);

    return React.createElement(
      "div",
      {},
      React.createElement("button", { id: 'add', onClick: () => setCount(count + 1) }, "addCount"),
      React.createElement("button", { id: 'reset', onClick: () => setCount(initialValue) }, "reset"),
      React.createElement("button", { id: 'same', onClick: () => setCount(count) }, "same"),
      React.createElement("span", { id: 'result' }, count),
    );
  }
);

export const SameStateValueVNode = React.createElement(
  function () {
    const initialValue = 0;
    const [ count, setCount ] = useState(initialValue);

    return React.createElement(
      "div",
      {},
      React.createElement("button", { id: 'same', onClick: () => setCount(count) }, "same"),
      React.createElement("span", { id: 'date' }, +new Date()),
    );
  }
);
