import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Chart5y from './chart5y.jsx';
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.requestData = this.requestData.bind(this);
  }

  requestData(path, callback) {
    // Makes a get request to the provided path for a randomly generated stock
    axios.get('/stocks/')
      .then(({data}) => { 
        var ticker = data[Math.floor(Math.random() * data.length)].ticker;
        axios.get(`/stocks/${ticker}/${path}`)
          .then(({data}) => { callback(data.last5yPrices); });
      });
  }

  render() {
    return (
      <div>
        <Chart5y requestData={this.requestData}/>
      </div>
    )
  }
};

ReactDOM.render(<App/>, document.getElementById('app'));