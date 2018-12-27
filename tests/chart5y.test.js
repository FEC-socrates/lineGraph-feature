import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render } from 'enzyme';

import App from '../client/components/app';
import Chart5y from '../client/components/chart5y';
import { mockRequestData, mock5yPrices } from './setupTests';

describe('Chart5y Component', () => {

  // Setup DOM for Jest tests
  var body = document.createElement('body');
  document.body = body;
  var div = document.createElement('div');
  div.id = 'app'
  document.body.appendChild(div);

  // Mount React components
  ReactDOM.render(<App/>, document.getElementById('app'));
  var app = mount(<App/>);
  var chart5y = mount(<Chart5y requestData={mockRequestData} handleMouseLeaveChart={app.instance().handleMouseLeaveChart} setChangeCaption={app.instance().setChangeCaption} setDefaultChangeCaption={app.instance().setDefaultChangeCaption}/>);

  // Load mock data into graph
  chart5y.instance().chart.series[0].setData(mock5yPrices);

  it('should mount successfully', () => {
    expect(chart5y.find('#graph').length).toEqual(1);
  });

  it('should contain data stored into the graph through setData', () => {
    expect(chart5y.instance().chart.series[0].data.length).toEqual(260);
  });

  // ADD: set chart data set company name, latestPrice, selectedPrice, refStartPrice, changeCaption
  // ADD: Simulate mouseleave

});