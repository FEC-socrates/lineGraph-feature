import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Chart5y from './chart5y.jsx';
import axios from 'axios';
import Odometer from 'react-odometerjs';


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

const Price = styled.h1`
  font-size: 36px;
  font-weight: 400;
  letter-spacing: -0.7px;
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
      companyName: null,
      latestPrice: null,
      selectedPrice: null
    };

    this.requestData = this.requestData.bind(this);
    this.setCompanyName = this.setCompanyName.bind(this);
    this.setSelectedPrice = this.setSelectedPrice.bind(this);
    this.setLatestPrice = this.setLatestPrice.bind(this);
  }

  setCompanyName(name) {
    this.setState({companyName: name});
  }

  setSelectedPrice(num) {
    this.setState({selectedPrice: num});
  }

  setLatestPrice(num) {
    this.setState({latestPrice: num});
  }

  requestData(path, callback) {
    // Makes a get request to the provided path for a randomly generated stock
    axios.get('/stocks/')
      .then(({data}) => { 
        var randomCompany = data[Math.floor(Math.random() * data.length)];
        this.setCompanyName(randomCompany.name);
        var ticker = randomCompany.ticker;
        axios.get(`/stocks/${ticker}/${path}`)
          .then(({data}) => { 
            this.setLatestPrice(data.last5yPrices[0].price);
            this.setSelectedPrice(data.last5yPrices[0].price);
            callback(data.last5yPrices); 
          });
      });
  }

  render() {
    return (
      <div>
        <CompanyName>{this.state.companyName}</CompanyName>
        <Odometer value={this.state.selectedPrice} format='(,ddd).dd' duration={300}></Odometer>
        <div id='container' onMouseLeave={() =>{this.setSelectedPrice(this.state.latestPrice); console.log('foo');}}>
          <Chart5y requestData={this.requestData} setSelectedPrice={this.setSelectedPrice}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));