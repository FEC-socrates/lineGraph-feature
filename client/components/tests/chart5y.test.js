import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render } from 'enzyme';
// import { JSDOM } from 'jsdom';
// const document = new JSDOM(`<!DOCTYPE html><div id='app'>FOO?</div>`).window.document;

import App from '../app';
import Chart5y from '../chart5y';

var body = document.createElement('body');
document.body = body;
var div = document.createElement('div');
div.id = 'app'
document.body.appendChild(div);
console.log('FOO ------>', window.document.getElementById('app'));

var mockRequestData = ('dataType', callback) => {
  if ('dataType' === 'last5yPrices') {
    return mock5yPrices;
  }
}

describe('Testing Enzyme', () => {

  ReactDOM.render(<App/>, document.getElementById('app'));

  var app = mount(<App/>);

  var chart5y = mount(<Chart5y handleMouseLeaveChart={app.instance().handleMouseLeaveChart} setChangeCaption={app.instance().setChangeCaption} />);

it('should render without throwing an error', () => {
    // this is only rendering chart5y without the parent and props functions being passed in!
    expect(chart5y.is('#container')).toBe(true);
  });
});