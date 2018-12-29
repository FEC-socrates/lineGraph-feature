import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Highcharts from 'highcharts';

class Chart5y extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);

    this.chart = null;
    this.apiEndpoint = null;
    this.defaultCaption = null;

    if (this.props.selectedGraph === '5Y') {
      this.apiEndpoint = 'last5yPrices';
      this.defaultCaption = 'Past 5 Years';
    } else if (this.props.selectedGraph === '1Y') {
      this.apiEndpoint = 'last1yPrices';
      this.defaultCaption = 'Past Year';
    } else if (this.props.selectedGraph === '3M') {
      this.apiEndpoint = 'last3mPrices';
      this.defaultCaption = 'Past 3 Months';
    } else if (this.props.selectedGraph === '1M') {
      this.apiEndpoint = 'last1mPrices';
      this.defaultCaption = 'Past Month';
    } else if (this.props.selectedGraph === '1W') {
      this.apiEndpoint = 'last1wPrices';
      this.defaultCaption = 'Past Week';
    } else if (this.props.selectedGraph === '1D') {
      this.apiEndpoint = 'last1dPrices';
      this.defaultCaption = 'Today';
    }

    this.props.setDefaultChangeCaption(this.defaultCaption);
    this.props.setChangeCaption(this.defaultCaption);
  }

  loadData(chart) {
    this.props.requestData(this.apiEndpoint, json => {
      var data = json.map(item => {
        return [item[this.apiEndpoint].datetime, item[this.apiEndpoint].price];
      });

      // For 1W graph: Dataset lives in five series (split by date)
      if (this.props.selectedGraph === '1W') {
        // Build an array with 5 nested arrays (each representing a series, but as long as the entire dataset)
        var series = [[],[],[],[],[]];
        series.forEach(array => {
          data.forEach(() => {
            array.push([]);
          });
        });
        series[0][0] = data[0];
        var index = 0;
        // Loop through the entire data set
        for (var i = 1; i < data.length - 1; i++) {
          // If data point is a new day
          if ((new Date(data[i-1][0])).getDate() !== (new Date(data[i][0])).getDate()) {
            // It should represent a new series
            series[index][i] = data[i];
            index++;
          }
          // Push the data to the appropriate series and point in the series
          series[index][i] = data[i];
        }
        // Loop thru each series and load it into the chart
        for (var i = 0; i < series.length; i++) {
          this.chart.series[i].setData(series[i]);
        }

      } else {
        // For 1M, 3M, 1Y and 5Y graphs: Dataset lives in one series
        this.chart.series[0].setData(data);
      }

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

      series: [
        { data: [], color: '#21ce99' },
        { data: [], color: '#21ce99' },
        { data: [], color: '#21ce99' },
        { data: [], color: '#21ce99' },
        { data: [], color: '#21ce99' }
    ],

      plotOptions: {
        series: {
          animation: false,
          marker: {
            enabled: false,
            symbol: 'circle',
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
          console.log(this.point);
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
