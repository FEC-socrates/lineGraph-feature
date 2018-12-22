import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Highcharts from 'highcharts';

class Chart5y extends React.Component {
  constructor(props) {
    super(props);
    this.request5yData = this.request5yData.bind(this);
    this.chart = null;
  }

  request5yData() {
    this.props.requestData('last5yPrices', json => {

      console.log(data);
      console.log(this.chart.series);

      var data = json.map(item => {
        return [item.datetime, item.price];
      });

      this.chart.series[0].setData(data);
    });
  }

  componentDidMount() {
    this.chart = Highcharts.chart('graph', {

      chart: {
        type: 'line' ,
        backgroundColor: '#1b1b1d',
        events: {
          load: this.request5yData
        }
      },

      series: [{
        name: 'test',
        data: [],
        color: '#21ce99'
      }],

      plotOptions: {
        series: {
          marker: {
            enabled: false,
            states: {
              hover: {
              lineColor: '#1b1b1d',
              lineWidth: 2,
              }
            }
          },
          states: {
            hover: {
              lineWidthPlus: 0,
              halo: false
            }
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