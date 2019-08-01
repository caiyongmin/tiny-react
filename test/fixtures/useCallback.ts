import { React, useState, useCallback } from './../../src';

function useInputValue(initialValue: string) {
  const [ value, setValue ] = useState(initialValue);
  const onChange = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLInputElement;
    setValue(target.value);
  }, []);

  return {
    value,
    onChange,
  };
}

export const useCallbackVNode = React.createElement(
  function () {
    const name = useInputValue('Jack');

    return React.createElement(
      "div",
      {},
      React.createElement("h3", {}, "useCallback"),
      React.createElement("input", { type: 'text', ...name }),
      React.createElement("div", { id: 'result' }, name.value),
    );
  }
);
