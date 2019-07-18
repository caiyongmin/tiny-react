import { React, ReactDOM } from './../src';
import FunctionComponent from './FunctionComponent';
import ClassComponent from './ClassComponent';
import HooksComponent from './HooksComponent';

class App extends React.Component {
  render() {
    return (
      <div>
        <FunctionComponent />
        <ClassComponent title="Todo List" />
        <HooksComponent />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
