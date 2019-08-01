import {
  React,
  useReducer,
  useCallback,
  useState,
  useMemo,
  useRef,
  useContext,
  useEffect,
} from '../src';

function UseEffect() {
  const [ toggle, setToggle ] = useState(false);
  const [ count, setCount ] = useState(0);

  useEffect(() => {
    console.info('===runEffect===');
    return () => {
      console.info('===cleanup===');
    };
  }, [toggle]);

  return (
    <div>
      <button onClick={() => setToggle(!toggle)}>toggle</button>
      <button onClick={() => setCount(count + 1)}>count</button>
    </div>
  );
}

export default function HooksTest() {
  return (
    <div>
      <UseEffect />
    </div>
  );
}
