import { React, useState, useEffect } from './../../src';

export const UseEffectComponent = function (props: {
  runEffectFn?: typeof jest.fn;
  cleanupFn?: typeof jest.fn;
}) {
  const { runEffectFn, cleanupFn } = props;
  const [ toggle, setToggle ] = useState(false);
  const [ count, setCount ] = useState(0);

  useEffect(() => {
    runEffectFn && runEffectFn();
    return () => {
      cleanupFn && cleanupFn();
    };
  }, [toggle]);

  return React.createElement(
    'div',
    {},
    React.createElement('button', { id: 'toggle', onClick: () => setToggle(!toggle) }, 'toggle'),
    React.createElement('button', { id: 'count', onClick: () => setCount(count + 1) }, 'count'),
  );
};
