import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>RENDERED.</div>
    )
  }
};

ReactDOM.render(<App/>, document.getElementById('app'));