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

const Options = styled.div`
  display: flex;
`;

const Option = styled.div`
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.25px;
  line-height: 19px;
  margin: 0;
  color: ${props => props.selected ? '#21ce99' : 'white'};
  border-bottom: 2px solid ${props => props.selected ? '#21ce99' : 'transparent'};
  padding-bottom: 12px;
  margin: 0 12px;
  cursor: pointer;
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
      defaultChangeCaption: null,
      selectedGraph: '5Y'
    };

    this.requestData = this.requestData.bind(this);
    this.setCompanyName = this.setCompanyName.bind(this);
    this.setSelectedPrice = this.setSelectedPrice.bind(this);
    this.setLatestPrice = this.setLatestPrice.bind(this);
    this.setRefStartPrice = this.setRefStartPrice.bind(this);
    this.setChangeCaption = this.setChangeCaption.bind(this);
    this.setDefaultChangeCaption = this.setDefaultChangeCaption.bind(this);
    this.handleMouseLeaveChart = this.handleMouseLeaveChart.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
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

  handleOptionClick(e) {
    if (e.target.classList.contains('option')) {
      this.setState({
        selectedGraph: e.target.innerHTML
      });
    }
  }

  requestData(path, callback) {
    // Makes a get request to the provided path for a randomly generated stock
    console.log('requestData called:', path);
    axios.get('/stocks/')
      .then(({data}) => { 
        var randomCompany = data[Math.floor(Math.random() * data.length)];
        this.setCompanyName(randomCompany.name);
        var ticker = randomCompany.ticker;
        axios.get(`/stocks/${ticker}/${path}`)
          .then(({data}) => { 
            console.log(data);
            this.setLatestPrice(data[data.length - 1][path].price);
            this.setSelectedPrice(data[data.length - 1][path].price);
            this.setRefStartPrice(data[0][path].price);
            callback(data); 
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
        <Chart5y key={this.state.selectedGraph} selectedGraph={this.state.selectedGraph} requestData={this.requestData} setSelectedPrice={this.setSelectedPrice} handleMouseLeaveChart={this.handleMouseLeaveChart} setChangeCaption={this.setChangeCaption} setDefaultChangeCaption={this.setDefaultChangeCaption} tooltipY={tooltipY}/>
        <Options onClick={this.handleOptionClick}>
          <Option className='option' selected={this.state.selectedGraph === '1D'}>1D</Option>
          <Option className='option' selected={this.state.selectedGraph === '1W'}>1W</Option>
          <Option className='option' selected={this.state.selectedGraph === '1M'}>1M</Option>
          <Option className='option' selected={this.state.selectedGraph === '3M'}>3M</Option>
          <Option className='option' selected={this.state.selectedGraph === '1Y'}>1Y</Option>
          <Option className='option' selected={this.state.selectedGraph === '5Y'}>5Y</Option>
        </Options>
      </div>
    );
  }
}

export default App;
