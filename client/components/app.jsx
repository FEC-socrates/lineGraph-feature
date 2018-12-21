import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Chart5y from './chart5y.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Chart5y/>
      </div>
    )
  }
};

ReactDOM.render(<App/>, document.getElementById('app'));