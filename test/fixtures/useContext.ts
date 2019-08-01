import { React, useContext, useMemo, useState } from './../../src';

export const CounterContext = React.createContext(0);

export const ContextChildVNode = React.createElement(
  function () {
    const count = useContext(CounterContext);
    return React.createElement('div', { className: 'context-child' }, count);
  }
);

export const ContextMemoChildVNode = React.createElement(
  function (props: {
    count: number;
  }) {
    const count = useContext(CounterContext);
    return useMemo(() => (
      React.createElement('div', { className: 'context-memo-child' }, +new Date())
    ), [props.count]);
  },
  { count: 0 },
);

export const CommonChildVNode = React.createElement(
  function () {
    const count = useContext(CounterContext);
    return React.createElement('div', { className: 'common-child' }, +new Date());
  },
  { count: 0 },
);

export const UseContextVNode = React.createElement(
  function () {
    const [ count, setCount ] = useState(0);

    return React.createElement(
      'div',
      {},
      React.createElement(
        CounterContext.Provider,
        { value: count },
        ContextChildVNode,
        ContextMemoChildVNode,
        CommonChildVNode
      ),
      React.createElement('div', { id: 'count', onClick: () => setCount(count + 1) }, 'setCount')
    );
  }
);
