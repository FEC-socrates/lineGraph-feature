import React from 'react';
import styled from 'styled-components';
import Chart from './chart.jsx';
import InfoButton from './infoButton.jsx'
import axios from 'axios';
import Odometer from 'react-odometerjs';


// ============================================
// STYLED COMPONENTS
// ===========================================

const AppContainer = styled.div`
  display: inline-block;
  width: 679px;
`;

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

const Captions = styled.div`
  height: 50px;
  display: flex;
  justify-content: space-between;
`;

const CaptionsRight = styled.div`
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

  :hover {
    color: #21ce99;
  }
`;

// ============================================
// REACT
// ===========================================

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ticker: null,
      companyName: null,
      latestPrice: null,
      latestAfterHours: null,
      selectedPrice: null,
      refStartPrice: null,
      changeCaption: null,
      defaultChangeCaption: null,
      selectedGraph: '1D',
      selectedCategory: null,
      analystBuy: null,
      platformOwners: null
    };
    
    this.requestData = this.requestData.bind(this);
    this.getYesterdayClose = this.getYesterdayClose.bind(this);
    this.setTicker = this.setTicker.bind(this);
    this.setCompanyName = this.setCompanyName.bind(this);
    this.setSelectedPrice = this.setSelectedPrice.bind(this);
    this.setLatestPrice = this.setLatestPrice.bind(this);
    this.setLatestAfterHours = this.setLatestAfterHours.bind(this);
    this.setRefStartPrice = this.setRefStartPrice.bind(this);
    this.setChangeCaption = this.setChangeCaption.bind(this);
    this.setDefaultChangeCaption = this.setDefaultChangeCaption.bind(this);
    this.handleMouseLeaveChart = this.handleMouseLeaveChart.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  setTicker(string, callback) {
    this.setState({ticker: string}, callback);
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

  setLatestAfterHours(num) {
    this.setState({latestAfterHours: num});
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
  // Makes a get request to the provided path for a randomly generated stock, and then invokes any provided callback

    // Get a list of all available stocks
    axios.get('/stocks/')
      .then(({data}) => { 
        // Select a company from the list with index number equal to the ID in the url
        var idFromURL = window.location.pathname.split('/')[1];
        var company = data[idFromURL-1];
        if (!company) { console.log('Stock not found for ID ' + idFromURL); }
        this.setCompanyName(company.name);
        var ticker = company.ticker;
        // Get details for the selected company
        axios.get(`/stocks/${ticker}`)
          .then(({data}) => {
            this.setState({
              analystBuy: (data.analystBuy*100).toFixed(0),
              platformOwners: data.platformOwners.toLocaleString()
            });
          });
        // Get price history for the selected company
        axios.get(`/stocks/${ticker}/${path}`)
          .then(({data}) => { 
            this.setTicker(ticker, () => {callback(data)});
          });
      });
  }

  getYesterdayClose(callback) {
  // Makes a get request specifically for yesterday's close price, and then invokes any provided callback
    axios.get(`/stocks/${this.state.ticker}/yesterdayClose/`)
      .then(({data}) => {callback(data)});
  }

  render() {
    var tooltipY = 110;
    var change = this.state.selectedPrice - this.state.refStartPrice;
    var changePercent = ((this.state.selectedPrice - this.state.refStartPrice) * 100 / this.state.refStartPrice).toFixed(2);
    var changeAfterHours = this.state.latestAfterHours - this.state.selectedPrice;
    var changePercentAfterHours = ((this.state.latestAfterHours - this.state.selectedPrice) * 100 / this.state.selectedPrice).toFixed(2);
    
    // A second line of price change captions should only show for the 1D graph view
    var afterHours = <div></div>;
    if (this.state.changeCaption === 'Today' && this.state.latestAfterHours) {
      afterHours = 
        <div>
          <Change id='changeAfterHours'>
            {changeAfterHours > 0 ? `+$${Math.abs(changeAfterHours).toFixed(2)}` : `-$${Math.abs(changeAfterHours).toFixed(2)}`} 
            {' (' + changePercentAfterHours + '%) '}
          </Change>
          <ChangeCaption id='changeCaptionAfterHours'>
            After Hours
          </ChangeCaption>
        </div>;
    }

    // Workaround for a known bug with Odometer where it does not show decimals if they are 0s.
    var odometerPrice = this.state.selectedPrice ? this.state.selectedPrice + 0.001 : null;

    return (
      <AppContainer>
        <CompanyName id='companyName'>{this.state.companyName}</CompanyName>

        <div><Odometer id='price' value={odometerPrice} format='(,ddd).ddd' duration={300}></Odometer></div>

        <Captions>
          <div>
            <div>
              <Change id='change'>
                {change > 0 ? `+$${Math.abs(change).toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`} 
                {' (' + changePercent + '%) '}
              </Change>
              <ChangeCaption id='changeCaption'>
                {this.state.changeCaption}
              </ChangeCaption>
            </div>
            {afterHours}
          </div>
          <CaptionsRight>
            <InfoButton 
              infoType='analystBuy' 
              value={this.state.analystBuy + '%'} 
              text={this.state.analystBuy + '% of analysts agree that ' + this.state.companyName + ' is a buy.'} width='70px'/>
            <InfoButton 
              infoType='platformOwners' 
              value={this.state.platformOwners} 
              text={this.state.platformOwners + ' people own ' + this.state.companyName + ' on Robinshood.'} width='100px'/>
          </CaptionsRight>
        </Captions>

        <Chart 
          key={this.state.selectedGraph} 
          ticker={this.state.ticker} 
          selectedGraph={this.state.selectedGraph} 
          requestData={this.requestData} 
          getYesterdayClose={this.getYesterdayClose} 
          setSelectedPrice={this.setSelectedPrice} 
          handleMouseLeaveChart={this.handleMouseLeaveChart} 
          setChangeCaption={this.setChangeCaption} 
          setDefaultChangeCaption={this.setDefaultChangeCaption} 
          setRefStartPrice={this.setRefStartPrice} 
          setLatestPrice={this.setLatestPrice} 
          setLatestAfterHours={this.setLatestAfterHours} 
          tooltipY={tooltipY}/>

        <Options onClick={this.handleOptionClick}>
          <Option className='option' selected={this.state.selectedGraph === '1D'}>1D</Option>
          <Option className='option' selected={this.state.selectedGraph === '1W'}>1W</Option>
          <Option className='option' selected={this.state.selectedGraph === '1M'}>1M</Option>
          <Option className='option' selected={this.state.selectedGraph === '3M'}>3M</Option>
          <Option className='option' selected={this.state.selectedGraph === '1Y'}>1Y</Option>
          <Option className='option' selected={this.state.selectedGraph === '5Y'}>5Y</Option>
        </Options>
      </AppContainer>
    );
  }
}

export default App;
