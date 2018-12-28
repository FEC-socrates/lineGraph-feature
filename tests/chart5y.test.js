import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render } from 'enzyme';

import App from '../client/components/app';
import Chart5y from '../client/components/chart5y';
import { mockRequestData, mock5yPrices } from './setupTests';

// ===========================================
// SETUP
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
  var chart5y = mount(<Chart5y requestData={mockRequestData} handleMouseLeaveChart={mockHandleMouseLeaveChart} setChangeCaption={app.instance().setChangeCaption} setDefaultChangeCaption={app.instance().setDefaultChangeCaption}/>);

  // Load mock data into graph
  chart5y.instance().chart.series[0].setData(mock5yPrices);


// ===========================================
// TESTS
// ===========================================

describe('Chart5y Component', () => {

  it('should mount successfully', () => {
    expect(chart5y.find('#graph').length).toEqual(1);
  });

  it('should contain data stored into the graph through setData', () => {
    expect(chart5y.instance().chart.series[0].data.length).toEqual(260);
  });

  it('should call handleMouseLeaveChart on mouseLeave event', () => {
    chart5y.find('#container').simulate('mouseLeave');
    expect(mockHandleMouseLeaveChart.mock.calls.length).toBe(1);
  });

});

describe('App Component', () => {

  it('should display default changeCaption', () => {
    expect(app.find('#changeCaption').first().text()).toEqual('Past 5 Years');
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

  it('should correctly set value property of #price element when dynamically set in state', () => {
    app.setState({
      selectedPrice: 222.22,
    });
    expect(app.find('#price').first().prop('value')).toEqual(222.22);
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