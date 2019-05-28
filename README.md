# creact

[![npm version](https://img.shields.io/npm/v/@caiym/react.svg?style=flat)](https://www.npmjs.com/package/@caiym/react) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](README.md)

React personal implementation version.

## Try

```bash
yarn

# need install parcel
npm start
```

## Features

- Familiar React render component with virtual dom.
- Support useState hook.

## Todos

- [x] Support render Class Component.
- [x] Support Class Component setState and lifecycle api.
- [ ] Support useEffect hook or other hooks api.
  - [x] Temporary only support useEffect hooks api.
- [x] Publish package.

## Usage

[![Edit creact-simple-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/epic-water-d6t2b?fontsize=14)

### FunctionComponent

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

### ClassComponent

```tsx
import { React } from "@caiym/react";

type ItemType = {
  id: string;
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
      text: ""
    };
  }

  handleChange = e => {
    this.setState({ text: e.target.value });
  };

  handleSubmit = e => {
    const { text } = this.state;

    e.preventDefault();
    if (!text.length) {
      return;
    }
    const newItem = {
      text,
      id: Date.now()
    };
    this.setState(state => ({
      items: state.items.concat(newItem),
      text: ""
    }));
  };

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
        {items.map(item => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ol>
    );
  }
}

export default TodoApp;
```

## Refs

Thank you here!

- [react-in-160-lines-of-javascript](https://medium.com/@sweetpalma/gooact-react-in-160-lines-of-javascript-44e0742ad60f).
- [从零开始实现一个React](https://github.com/hujiulong/blog/issues/4).
- [Preact](https://github.com/developit/preact).

Welcome to commit [issue](https://github.com/caiyongmin/creact/issues) & [pull request](https://github.com/caiyongmin/creact/pulls) !
