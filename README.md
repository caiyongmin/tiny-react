# creact

[![npm version](https://img.shields.io/npm/v/@caiym/react.svg?style=flat)](https://www.npmjs.com/package/@caiym/react) ![](https://badgen.net/bundlephobia/minzip/@caiym/react) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](README.md)

[React](https://reactjs.org/) personal implementation version.

## Run

```bash
yarn

# need install parcel：
# - yarn global add parcel-bundler
# - npm install -g parcel-bundler
npm start
```

## Features

- Familiar React render component with virtual dom.
- Support `useState` hook.

## Todos

- [x] Support render `Class Component`.
- [x] Support Class Component `setState` and `lifecycle api`.
- [ ] Support other hooks api.
  - [x] support `useEffect`.
  - [x] support `useReducer`.
  - [x] support `useCallback` / `useMemo` / `useRef`.
  - [x] support `useContext`.
- [x] Publish package.
- [ ] Add unit test.
- [ ] Clarify the code design and add necessary comments.

## Examples

- [render Function Component and Class Component](#render-function-component-and-class-component).
- [render useState Component](#render-usestate-component).
- [render useEffect Component](#render-useeffect-component).
- [render useReducer Component](#render-usereducer-component).
- [render useCallback Component](#render-usecallback-component).
- [render useMemo Component](#render-usememo-component).
- [render useRef Component](#render-useref-component).
- [render useContext Component](#render-usecontext-component).

### render Function Component and Class Component
<a href="#examples" style="font-size: 14px">↥ back to examples</a>

[![Edit creact-simple-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/epic-water-d6t2b?fontsize=14)

#### Function Component

```tsx
import { React, useState } from "@caiym/react";

function Event() {
  return <span>Event</span>;
}

function Log() {
  return <span>Log</span>;
}

export default function HooksFunction() {
  const [toggle, setToggle] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        useState toggle
      </button>
      &nbsp;&nbsp;
      {toggle ? <Event /> : <Log />}
    </div>
  );
}
```

#### Class Component

```tsx
import { React } from "@caiym/react";

type ItemType = {
  id: number;
  text: string;
};

interface TodoAppProps {
  title: string;
}

interface TodoAppState {
  text: string;
  items: ItemType[];
}

class TodoApp extends React.Component<TodoAppProps, TodoAppState> {
  constructor(props: TodoAppProps) {
    super(props);

    this.state = {
      items: [],
      text: "",
    };
  }

  handleChange = (e: MouseEvent) => {
    const target = e.target as HTMLInputElement;
    this.setState({ text: target.value });
  }

  handleSubmit = (e: MouseEvent) => {
    const { text } = this.state;

    e.preventDefault();
    if (!text.length) {
      return;
    }
    const newItem = {
      text,
      id: Date.now(),
    };
    this.setState((state: TodoAppState) => ({
      items: state.items.concat(newItem),
      text: '',
    }));
  }

  render() {
    const { title } = this.props;
    const { items, text } = this.state;

    return (
      <div>
        <h3>{title}</h3>
        <TodoList items={items} />
        <form>
          <label htmlFor="new-todo">What needs to be done?</label>
          <br />
          <input
            autocomplete="off"
            id="new-todo"
            onChange={this.handleChange}
            value={text}
          />
          &nbsp;&nbsp;
          <button onClick={this.handleSubmit}>Add #{items.length + 1}</button>
        </form>
      </div>
    );
  }
}

interface TodoListProps {
  items: ItemType[];
}

class TodoList extends React.Component<TodoListProps> {
  render() {
    const { items } = this.props;

    return (
      <ol>
        {items.map((item: ItemType) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ol>
    );
  }
}

export default TodoApp;
```

#### Render

```tsx
import { React, ReactDOM } from "@caiym/react";
import FunctionComponent from "./FunctionComponent";
import ClassComponent from "./ClassComponent";

class App extends React.Component {
  render() {
    return (
      <div>
        <FunctionComponent />
        <ClassComponent title="React Todo" />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
```

### render useState Component
<a href="#examples" style="font-size: 14px">↥ back to examples</a>

[![Edit creact useState demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/creact-usestate-demo-njttc?fontsize=14)

```tsx
import { useState } from "@caiym/react";

function UseStateComponent() {
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
```

### render useEffect Component
<a href="#examples" style="font-size: 14px">↥ back to examples</a>

[![Edit creact useEffect demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/creact-useeffect-demo-nqt27?fontsize=14)

```tsx
import { useState, useEffect } from "@caiym/react";

function UseEffectComponent() {
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
```

### render useReducer Component
<a href="#examples" style="font-size: 14px">↥ back to examples</a>

[![Edit creact useReducer demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/creact-usereducer-demo-fvz45?fontsize=14)

```tsx
import { useReducer } from "@caiym/react";

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
function UseReducerComponent() {
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
```

### render useCallback Component
<a href="#examples" style="font-size: 14px">↥ back to examples</a>

[![Edit creact useCallback demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/creact-usecallback-demo-422lf?fontsize=14)

```tsx
import { useCallback, useState } from "@caiym/react";

function useInputValue(initialValue: string) {
  const [ value, setValue ] = useState(initialValue);
  // stable onChange prop, avoid unnecessary render
  const onChange = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLInputElement;
    setValue(target.value);
  }, []);

  return {
    value,
    onChange,
  };
}
function UseCallbackComponent() {
  const name = useInputValue('Jack');

  return (
    <div>
      <h3>useCallback</h3>
      <input type="text" {...name} />
      <div>Value: {name.value}</div>
    </div>
  );
}
```

### render useMemo Component
<a href="#examples" style="font-size: 14px">↥ back to examples</a>

In fact, the example is't very suitable, because re-render of MemoChild component has been avoided by props comparison. For a better example, please look at the example of [render useContext Component](#render-usecontext-component).

[![Edit creact useMemo demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/creact-usememo-demo-r8rwp?fontsize=14)

```tsx
import { useMemo, useState } from "@caiym/react";

function MemoChild(props: {
  count: number;
}) {
  return useMemo(() => (
    <div>MemoChild: {+new Date()}</div>
  ), [props.count]);
}
function UseMemoComponent() {
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
```

### render useRef Component
<a href="#examples" style="font-size: 14px">↥ back to examples</a>

[![Edit creact useRef demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/creact-useref-demo-955mp?fontsize=14)

```tsx
import { useRef } from "@caiym/react";

function UseRefComponent() {
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
```

### render useContext Component
<a href="#examples" style="font-size: 14px">↥ back to examples</a>

[![Edit creact useContext demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/creact-usecontext-demo-f7bkf?fontsize=14)

```tsx
import { React, useState, useContext } from "@caiym/react";

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

function UseContextComponent() {
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
```

## Refs

Thank you here!

- [react-in-160-lines-of-javascript](https://medium.com/@sweetpalma/gooact-react-in-160-lines-of-javascript-44e0742ad60f).
- [从零开始实现一个React](https://github.com/hujiulong/blog/issues/4).
- [Preact](https://github.com/developit/preact).

Welcome to commit [issue](https://github.com/caiyongmin/creact/issues) & [pull request](https://github.com/caiyongmin/creact/pulls) !
