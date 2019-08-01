import { React, useRef } from './../../src';

export const useRefVNode = React.createElement(
  function UseCallbackComponent() {
    const inputEl = useRef(null);
    const onButtonClick = () => {
      // `current` points to the mounted text input element
      inputEl.current.focus();
    };

    return React.createElement(
      'div',
      {},
      React.createElement('input', { type: 'text', ref: inputEl }),
      React.createElement('button', { id: 'focus', onClick: onButtonClick }, 'Focus the input'),
    );
  }
);
