import { React } from './../src';

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
      text: ''
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
      id: Date.now()
    };
    this.setState((state: TodoAppState) => ({
      items: state.items.concat(newItem),
      text: ''
    }));
  }

  render() {
    const { items, text } = this.state;

    return (
      <div>
        <h3>TODO</h3>
        <TodoList items={items} />
        <form>
          <label htmlFor="new-todo">
            What needs to be done?
          </label>
          <br/>
          <input autocomplete="off" id="new-todo" onChange={this.handleChange} value={text} />
          &nbsp;&nbsp;
          <button onClick={this.handleSubmit}>
            Add #{items.length + 1}
          </button>
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
