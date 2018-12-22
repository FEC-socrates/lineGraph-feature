import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Chart5y from './chart5y.jsx';
import axios from 'axios'

// ============================================
// STYLED COMPONENTS
// ===========================================

const CompanyName = styled.h1`
  font-size: 36px;
  font-weight: 500;
  letter-spacing: -0.29px;
  line-height: 42px;
  margin: 0;
  color: white;
`;


// ============================================
// REACT
// ===========================================

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      companyName: null
    };

    this.requestData = this.requestData.bind(this);
    this.setCompanyName = this.setCompanyName.bind(this);
  }

  setCompanyName(name) {
    this.setState({companyName: name});
  }

  requestData(path, callback) {
    // Makes a get request to the provided path for a randomly generated stock
    axios.get('/stocks/')
      .then(({data}) => { 
        var randomCompany = data[Math.floor(Math.random() * data.length)];
        this.setCompanyName(randomCompany.name);
        var ticker = randomCompany.ticker;
        axios.get(`/stocks/${ticker}/${path}`)
          .then(({data}) => { callback(data.last5yPrices); });
      });
  }

  render() {
    return (
      <div>
        <CompanyName>{this.state.companyName}</CompanyName>
        <Chart5y requestData={this.requestData}/>
      </div>
    )
  }
};

ReactDOM.render(<App/>, document.getElementById('app'));