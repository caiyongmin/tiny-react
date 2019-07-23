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

export function UseStateComponent() {
  const initialValue = 0;
  const [ count, setCount ] = useState(initialValue);

  return (
    <div>
      <h3>useState</h3>
      <div>
        <button onClick={() => setCount(count + 1)}>setCount</button>
        <button onClick={() => setCount(initialValue)}>reset</button>
        &nbsp;&nbsp;
        {count}
      </div>
    </div>
  );
}

export function UseEffectComponent() {
  const [ toggle, setToggle ] = useState(false);
  const [ count, setCount ] = useState(0);

  useEffect(() => {
    console.info('===run useEffect function===');
    return () => {
      console.info('===unmount before re-run useEffect function===');
    };
  }, [toggle]);

  return (
    <div>
      <h3>useEffect</h3>
      <div style={{ fontSize: '12px', color: 'gray' }}>需要打开控制台查看运行结果</div>
      <button onClick={() => setToggle(!toggle)}>
        setToggle trigger run useEffect function, toggle: {String(toggle)}
      </button>
      <div>
        <button onClick={() => setCount(count + 1)}>
          setCount don't trigger run useEffect function, count: {count}
        </button>
      </div>
    </div>
  );
}

const sleep = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

type ReducerState = {
  count: number;
  loading: boolean;
};
const ACTIONS = {
  INCREASE: 'increase',
  DECREASE: 'decrease',
  LOADING: 'loading',
  RESET: 'reset',
};
const initialState = {
  count: 0,
  loading: false,
};
const countReducer = (state: ReducerState, action: { type: string; [key: string]: string }) => {
  switch (action.type) {
    case ACTIONS.INCREASE:
      return { ...state, loading: false, count: state.count + 1 };
    case ACTIONS.DECREASE:
      return { ...state, loading: false, count: state.count - 1 };
    case ACTIONS.LOADING:
      return { ...state, loading: true };
    case ACTIONS.RESET:
      return { ...state, loading: false, count: initialState.count };
    default:
      return state;
  }
}
export function UseReducerComponent() {
  const [ state, dispatch ] = useReducer(countReducer, initialState);
  const { count, loading } = state;
  const onIncreaseHandler = async () => {
    dispatch({ type: ACTIONS.LOADING });
    await sleep();
    dispatch({ type: ACTIONS.INCREASE });
  };
  const onDecreaseHandler = async () => {
    dispatch({ type: ACTIONS.LOADING });
    await sleep();
    dispatch({ type: ACTIONS.DECREASE });
  };
  const onResetHandler = async () => {
    dispatch({ type: ACTIONS.LOADING });
    await sleep();
    dispatch({ type: ACTIONS.RESET });
  };

  return (
    <div>
      <h3>useReducer</h3>
      <div className="result">Count: {loading ? 'loading...' : count}</div>
      <div className="operators">
        <button onClick={onIncreaseHandler}>+</button>
        <button onClick={onDecreaseHandler}>-</button>
        <button onClick={onResetHandler}>reset</button>
      </div>
    </div>
  );
}

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
export function UseCallbackComponent() {
  const name = useInputValue('Jack');

  return (
    <div>
      <h3>useCallback</h3>
      <input type="text" {...name} />
      <div>Value: {name.value}</div>
    </div>
  );
}

function MemoChild(props: {
  count: number;
}) {
  return useMemo(() => (
    <div>MemoChild: {+new Date()}</div>
  ), [props.count]);
}
export function UseMemoComponent() {
  let [ count, setCount ] = useState(0);
  let [ num, setNum ] = useState(0);

  return (
    <div>
      <h3>useMemo</h3>
      <div>Count: {count}</div>
      <div>Number: {num}</div>
      <MemoChild count={count} />
      <button onClick={() => setCount(count + 1)}>
        setCount to trigger MemoChild re-render
      </button>
      <br/>
      <button onClick={() => setNum(num + 1)}>
        setNum don't trigger MemoChild re-render
      </button>
    </div>
  );
}

export function UseRefComponent() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };

  return (
    <div>
      <h3>useRef</h3>
      <input ref={inputEl} type="text"/>
      <button onClick={onButtonClick}>Focus the input</button>
    </div>
  );
}

const CounterContext = React.createContext(0);
function ContextChild() {
  const count = useContext(CounterContext);
  return (
    <div>count: {count}</div>
  );
}
function ContextMemoChild(props: {
  count: number;
}) {
  return useMemo(() => (
    <div>MemoChild: {+new Date()}</div>
  ), [props.count]);
}
function CommonChild(props: {
  count: number;
}) {
  return <div>CommonChild: {+new Date()}</div>;
}
export function UseContextComponent() {
  const [ count, setCount ] = useState(0);
  return (
    <div>
      <h3>useContext</h3>
      <CounterContext.Provider value={count}>
        <ContextChild />
        <div>
          <ContextChild />
          <ContextMemoChild count={0} />
          <CommonChild count={0} />
        </div>
      </CounterContext.Provider>
      <button onClick={() => setCount(count + 1)}>setCount</button>
    </div>
  );
}

export default function HooksComponent() {
  return (
    <div>
      <h2>Hooks Component</h2>
      <UseStateComponent />
      <UseEffectComponent />
      <UseReducerComponent />
      <UseCallbackComponent />
      <UseMemoComponent />
      <UseRefComponent />
      <UseContextComponent />
    </div>
  );
};
