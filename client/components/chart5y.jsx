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
    var setSelectedPrice = this.props.setSelectedPrice;

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

      tooltip: {
        animation: false,
        outside: true,
        backgroundColor: '#1b1b1d',
        borderWidth: 0,
        shadow: false,
        style: {
          color: '#8c8c8e'
        },
        positioner: (labelWidth, labelHeight, {plotX}) => {
          return {x: plotX - 43, y: 0};
        },
        formatter: function() {
          setSelectedPrice(this.point.y);
          var date = new Date(this.point.name);
          date = date.toLocaleDateString('en-us', {month: 'short', day: 'numeric', year:'numeric'}).toUpperCase();
          return date;
        }
      },

      credits: false,

      legend: {
        enabled: false
      },

      xAxis: {
        visible: false,
        crosshair: {
          color: '#8c8c8e'
        }
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