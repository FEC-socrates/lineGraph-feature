import React from 'react';
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

const Change = styled.span`
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.25px;
  line-height: 19px;
  margin: 0;
  color: white;
`;

const ChangeCaption = styled.span`
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.25px;
  line-height: 19px;
  margin: 0;
  color: #8c8c8e;
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
      selectedPrice: null,
      refStartPrice: null,
      changeCaption: null,
      defaultChangeCaption: null
    };

    this.requestData = this.requestData.bind(this);
    this.setCompanyName = this.setCompanyName.bind(this);
    this.setSelectedPrice = this.setSelectedPrice.bind(this);
    this.setLatestPrice = this.setLatestPrice.bind(this);
    this.setRefStartPrice = this.setRefStartPrice.bind(this);
    this.setChangeCaption = this.setChangeCaption.bind(this);
    this.setDefaultChangeCaption = this.setDefaultChangeCaption.bind(this);
    this.handleMouseLeaveChart = this.handleMouseLeaveChart.bind(this);
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

  setRefStartPrice(num) {
    this.setState({refStartPrice: num});
  }

  setChangeCaption(string) {
    this.setState({changeCaption: string});
  }

  setDefaultChangeCaption(string) {
    this.setState({defaultChangeCaption: string});
  }

  handleMouseLeaveChart() {
    this.setSelectedPrice(this.state.latestPrice);
    this.setChangeCaption(this.state.defaultChangeCaption);
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
            this.setRefStartPrice(data.last5yPrices[data.last5yPrices.length - 1].price);
            callback(data.last5yPrices); 
          });
      });
  }

  render() {
    var tooltipY = 110;
    var change = (this.state.selectedPrice - this.state.refStartPrice).toFixed(2);
    var changePercent = ((this.state.selectedPrice - this.state.refStartPrice) * 100 / this.state.refStartPrice).toFixed(2);
    return (
      <div>
        <CompanyName id='companyName'>{this.state.companyName}</CompanyName>
        <div><Odometer id='price'value={this.state.selectedPrice} format='(,ddd).dd' duration={300}></Odometer></div>
        <div><Change id='change'>{change > 0 ? `+$${Math.abs(change)}` : `-$${Math.abs(change)}`} {'(' + changePercent + '%) '}</Change><ChangeCaption id='changeCaption'>{this.state.changeCaption}</ChangeCaption></div>
        <Chart5y requestData={this.requestData} setSelectedPrice={this.setSelectedPrice} handleMouseLeaveChart={this.handleMouseLeaveChart} setChangeCaption={this.setChangeCaption} setDefaultChangeCaption={this.setDefaultChangeCaption} tooltipY={tooltipY}/>
      </div>
    );
  }
}

export default App;
