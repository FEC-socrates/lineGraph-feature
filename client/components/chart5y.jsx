import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Highcharts from 'highcharts';

class Chart5y extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.chart = null;
  }

  loadData(chart) {
    var setChangeCaption = this.props.setChangeCaption;
    var setDefaultChangeCaption = this.props.setDefaultChangeCaption;
    var path = '';
    var defaultCaption;

    if (this.props.selectedGraph === '5Y') {
      path = 'last5yPrices';
      defaultCaption = 'Past 5 Years'
    } else if (this.props.selectedGraph === '1Y') {
      path = 'last1yPrices';
      defaultCaption = 'Past Year'
    } else if (this.props.selectedGraph === '3M') {
      path = 'last3mPrices';
      defaultCaption = 'Past 3 Months'
    } else if (this.props.selectedGraph === '1M') {
      path = 'last1mPrices';
      defaultCaption = 'Past Month'
    } else if (this.props.selectedGraph === '1W') {
      path = 'last1wPrices';
      defaultCaption = 'Past Week'
    } else if (this.props.selectedGraph === '1D') {
      path = 'last1dPrices';
      defaultCaption = 'Today'
    }

    setDefaultChangeCaption(defaultCaption);
    setChangeCaption(defaultCaption);

    this.props.requestData(path, json => {

      console.log(json);

      var data = json.map(item => {
        return [item[path].datetime, item[path].price];
      });

      this.chart.series[0].setData(data);
    });
  }

  componentDidMount() {
    var setChangeCaption = this.props.setChangeCaption;
    var setSelectedPrice = this.props.setSelectedPrice;
    var tooltipY = this.props.tooltipY;

    this.chart = Highcharts.chart('graph', {

      chart: {
        type: 'line',
        backgroundColor: '#1b1b1d',
        events: {
          load: this.loadData
        }
      },

      series: [{
        name: 'test',
        data: [],
        color: '#21ce99'
      }],

      plotOptions: {
        series: {
          animation: false,
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
