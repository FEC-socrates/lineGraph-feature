import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Highcharts from 'highcharts';

class Chart5y extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('foo');
    var chart = Highcharts.chart('graph', {

      chart: {
        type: 'line' ,
        backgroundColor: '#1b1b1d'
      },

      series: [{
        name: 'test',
        data: [1, 2, 3, 4, 5],
        color: '#21ce99'
      }],

      plotOptions: {
        series: {
          marker: {
            enabled: false
          }
        }
      },

      title: {
        text: undefined
      },

      credits: false,

      legend: {
        enabled: false
      },

      xAxis: {
        visible: false,
        crosshair: true
      },

      yAxis: {
        visible: false
      }
    });
  }

  render() {
    return (
      <div id='graph'>Chart Goes HereX</div>
    )
  }
};

export default Chart5y;