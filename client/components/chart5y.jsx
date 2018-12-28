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

  request5yData(chart) {
    this.props.requestData('last5yPrices', json => {

      console.log(json);

      var data = json.map(item => {
        return [item.datetime, item.price];
      });

      this.chart.series[0].setData(data);
    });
  }

  componentDidMount() {
    var setSelectedPrice = this.props.setSelectedPrice;
    var setChangeCaption = this.props.setChangeCaption;
    var setDefaultChangeCaption = this.props.setDefaultChangeCaption;
    var tooltipY = this.props.tooltipY;
    var defaultCaption = 'Past 5 Years';
    setDefaultChangeCaption(defaultCaption);
    setChangeCaption(defaultCaption);

    this.chart = Highcharts.chart('graph', {

      chart: {
        type: 'line',
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
                lineWidth: 2
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
        positioner: (labelWidth, labelHeight, point) => {
          console.log(point);
          return {x: point.plotX - 43, y: tooltipY};
        },
        formatter: function() {
          setSelectedPrice(this.point.y);
          setChangeCaption('');
          var date = new Date(this.point.name);
          date = date.toLocaleDateString('en-us', {month: 'short', day: 'numeric', year: 'numeric'}).toUpperCase();
          return date;
        }
      },

      credits: false,

      legend: {
        enabled: false
      },

      xAxis: {
        visible: false,
        reversed: true,
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
      <div id='container' onMouseLeave={() => { this.props.handleMouseLeaveChart(); }}>
        <div id='graph'>Chart Goes HereX</div>
      </div>
    );
  }
}

export default Chart5y;
