import { React, ReactDOM } from './../src';
import FunctionComponent from './FunctionComponent';
import ClassComponent from './ClassComponent';

class App extends React.Component {
  render() {
    return (
      <div>
        <FunctionComponent />
        <hr/>
        <ClassComponent title="React Todo" />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
