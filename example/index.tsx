import { React, ReactDOM } from './../src';
import FunctionComponent from './FunctionComponent';
import ClassComponent from './ClassComponent';
import HooksComponent from './HooksComponent';
import HooksTest from './HooksTest';

class App extends React.Component {
  render() {
    return (
      <div>
        {/* <FunctionComponent /> */}
        {/* <ClassComponent title="Todo List" /> */}
        <HooksComponent />
        {/* <HooksTest /> */}
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
