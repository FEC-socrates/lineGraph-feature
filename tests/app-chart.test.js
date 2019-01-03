import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render } from 'enzyme';

import App from '../client/components/App.jsx';
import Chart from '../client/components/Chart.jsx';
import { mockRequestData, mockGetYesterdayClose} from './setupTests';

// ===========================================
// SETUP - 5Y, 1Y, 3M and 1M GRAPH VIEWS
// ===========================================

  // Setup DOM for Jest tests
  var body = document.createElement('body');
  document.body = body;
  var div = document.createElement('div');
  div.id = 'app'
  document.body.appendChild(div);

  // Mount React components
  ReactDOM.render(<App/>, document.getElementById('app'));
  var app = mount(<App/>);
  var mockHandleMouseLeaveChart = jest.fn();
  var chartComponent = <Chart 
    requestData={mockRequestData} 
    handleMouseLeaveChart={mockHandleMouseLeaveChart} 
    setChangeCaption={app.instance().setChangeCaption} 
    setDefaultChangeCaption={app.instance().setDefaultChangeCaption} 
    setLatestPrice={app.instance().setLatestPrice} 
    setSelectedPrice={app.instance().setSelectedPrice} 
    setRefStartPrice={app.instance().setRefStartPrice} 
    setLatestAfterHours={app.instance().setLatestAfterHours} 
    getYesterdayClose={mockGetYesterdayClose}
  />

  var chart = mount(chartComponent);

  beforeEach(() => {
    chart.unmount();
    chart = mount(chartComponent);
  })

// ===========================================
// TESTS - 5Y, 1Y, 3M and 1M GRAPH VIEWS
// ===========================================

describe('Chart Component for 5Y, 1Y, 3M and 1M Views', () => {

  it('should mount successfully', () => {
    expect(chart.find('#graph').length).toEqual(1);
  });

  it('should contain data stored into the graph through loadData', done => {
    chart.setProps({selectedGraph: '5Y'});
    chart.instance().apiEndpoint = 'last5yPrices';
    chart.instance().loadData(() => {
      expect(chart.instance().chart.series[5].data.length).not.toEqual(0);
      done();
    });
  });

  it('should call handleMouseLeaveChart on mouseLeave event', () => {
    chart.find('#container').simulate('mouseLeave');
    expect(mockHandleMouseLeaveChart.mock.calls.length).toBe(1);
  });

});

describe('App Component for 5Y, 1Y, 3M and 1M Views', () => {

  it('should correctly display default changeCaption when 5Y graph is selected', () => {
    app.setState({selectedGraph: '5Y'});
    expect(app.find('#changeCaption').first().text()).toEqual('Past 5 Years');
  });

  it('should correctly display default changeCaption when 1Y graph is selected', () => {
    app.setState({selectedGraph: '1Y'});
    expect(app.find('#changeCaption').first().text()).toEqual('Past Year');
  });

  it('should correctly display default changeCaption when 3M graph is selected', () => {
    app.setState({selectedGraph: '3M'});
    expect(app.find('#changeCaption').first().text()).toEqual('Past 3 Months');
  });

  it('should correctly display default changeCaption when 1M graph is selected', () => {
    app.setState({selectedGraph: '1M'});
    expect(app.find('#changeCaption').first().text()).toEqual('Past Month');
  });
  
  it('should correctly set companyName in state using setCompanyName method', () => {
    app.instance().setCompanyName('Company X');
    expect(app.state('companyName')).toEqual('Company X');
  });
  
  it('should correctly set selectedPrice in state using setSelectedPrice method', () => {
    app.instance().setSelectedPrice(999.99);
    expect(app.state('selectedPrice')).toEqual(999.99);
  });

  it('should correctly set latestPrice in state using setLatestPrice method', () => {
    app.instance().setLatestPrice(888.88);
    expect(app.state('latestPrice')).toEqual(888.88);
  });

  it('should correctly set refStartPrice in state using setRefStartPrice method', () => {
    app.instance().setRefStartPrice(777.77);
    expect(app.state('refStartPrice')).toEqual(777.77);
  });

  it('should correctly set changeCaption in state using setChangeCaption method', () => {
    app.instance().setChangeCaption('Bugs Bunny');
    expect(app.state('changeCaption')).toEqual('Bugs Bunny');
  });

  it('should correctly set defaultChangeCaption in state using setDefaultChangeCaption method', () => {
    app.instance().setDefaultChangeCaption('Mickey Mouse');
    expect(app.state('defaultChangeCaption')).toEqual('Mickey Mouse');
  });

  it('should display company name on DOM when dynamically set in state', () => {
    app.setState({
      companyName: 'testCo',
    });
    expect(app.find('#companyName').first().text()).toEqual('testCo');
  });

  it('should correctly set value property of #price element when dynamically set in state (with 0.001 added as a bugfix workaround)', () => {
    app.setState({
      selectedPrice: 222.22,
    });
    expect(app.find('#price').first().prop('value')).toEqual(222.221);
  });

  it('should display changeCaption on DOM when dynamically set in state', () => {
    app.setState({
      changeCaption: 'testCaption',
    });
    expect(app.find('#changeCaption').first().text()).toEqual('testCaption');
  });

  it('should calculate and display change between start and selectedPrice when dynamically set in state', () => {
    app.setState({
      latestPrice: 111.11,
      selectedPrice: 222.22,
      refStartPrice: 333.33,
    });
    expect(app.find('#change').first().text()).toEqual('-$111.11 (-33.33%) ');
  });

});

// ===========================================
// TESTS - 1W GRAPH VIEWS
// ===========================================

describe('Chart Component for 1W View', () => {

  it('should contain data stored into the graph through loadData', done => {
    chart.setProps({selectedGraph: '1W'});
    chart.instance().apiEndpoint = 'last1wPrices';
    chart.instance().loadData(() => {
      expect(chart.instance().chart.series[0].data.length).not.toEqual(0);
      expect(chart.instance().chart.series[1].data.length).not.toEqual(0);
      expect(chart.instance().chart.series[2].data.length).not.toEqual(0);
      expect(chart.instance().chart.series[3].data.length).not.toEqual(0);
      expect(chart.instance().chart.series[4].data.length).not.toEqual(0);
      done();
    });
  });

});

describe('App Component for 1W View', () => {

  it('should correctly display default changeCaption when 1W graph is selected', () => {
    app.setState({selectedGraph: '1W'});
    expect(app.find('#changeCaption').first().text()).toEqual('Past Week');
  });

  it('should NOT display After Hours caption for 1W view', () => {
    app.setState({selectedGraph: '1W', changeCaption: 'Past Week'});
    expect(app.find('#changeCaptionAfterHours').length).toEqual(0);
  });

});


// ===========================================
// TESTS - 1D GRAPH VIEWS
// ===========================================

describe('Chart Component for 1D View', () => {

  it('should contain data stored into the graph through loadData', done => {
    chart.setProps({selectedGraph: '1D'});
    chart.instance().apiEndpoint = 'last1dPrices';
    chart.instance().loadData(() => {
      expect(chart.instance().chart.series[0].data.length).not.toEqual(0);
      done();
    });
  });

});

describe('App Component for 1D View', () => {

  it('should correctly set latestAfterHours in state using setLatestAfterHours method', () => {
    app.instance().setLatestAfterHours('Donald Duck');
    expect(app.state('latestAfterHours')).toEqual('Donald Duck');
  });

  it('should correctly display default changeCaption when 1D graph is selected', () => {
    app.setState({selectedGraph: '1D'});
    expect(app.find('#changeCaption').first().text()).toEqual('Today');
  });

  it('should display After Hours caption for 1D view', () => {
    app.setState({selectedGraph: '1D', changeCaption: 'Today'});
    expect(app.find('#changeCaptionAfterHours').first().text()).toEqual('After Hours');
  });

})
