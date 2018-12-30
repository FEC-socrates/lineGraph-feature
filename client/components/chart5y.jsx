import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Highcharts from 'highcharts';
import axios from 'axios';

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

  loadData() {
    this.props.requestData(this.apiEndpoint, json => {
      var data = json.map(item => {
        if (item[this.apiEndpoint].priceType) {
          return [item[this.apiEndpoint].datetime, item[this.apiEndpoint].price, item[this.apiEndpoint].priceType];
        } else {
          return [item[this.apiEndpoint].datetime, item[this.apiEndpoint].price];
        }
      });

      if (this.props.selectedGraph === '1W' || this.props.selectedGraph === '1D') {
        // For 1W graph: Dataset lives in five series (split by date)
        if (this.props.selectedGraph === '1W') {
          // Build an array with 5 nested arrays (each representing a series, but as long as the entire dataset)
          var series = [[],[],[],[],[]];
        // Else, for 1D graph: Dataset lives in three series (split by priceType)
        } else {
          // Build an array with 3 nested arrays (each representing a series, but as long as the entire dataset)
          var series = [[],[],[]];
        }

        series.forEach(array => {
          data.forEach(() => {
            array.push([]);
          });
        });
        series[0][0] = data[0];
        var index = 0;
        // Loop through the entire data set
        for (var i = 1; i < data.length - 1; i++) {
          // For 1w, if data point is a new day
          if (this.props.selectedGraph === '1W' && ((new Date(data[i-1][0])).getDate() !== (new Date(data[i][0])).getDate())) {
            // It should represent a new series
            series[index][i] = data[i];
            index++;
          }
          // For 1d, if data point is a new priceType
          if (this.props.selectedGraph === '1D' && (data[i-1][2] !== data[i][2])) {
            // It should represent a new series
            series[index][i] = data[i];
            index++;
          }
          // Push the data to the appropriate series and point in the series
          series[index][i] = data[i];
        }
        // Loop thru each series and load it into the chart
        console.log(series);
        for (var i = 0; i < series.length; i++) {
          this.chart.series[i].setData(series[i]);
        }        
      } else {
        // For 1M, 3M, 1Y and 5Y graphs: Dataset lives in one series
        this.chart.series[5].setData(data);
      }

    // If graph is 1D, add plotline
    if (this.props.selectedGraph === '1D') {
      this.getYesterdayClose(data => {
        this.chart.yAxis[0].addPlotLine({
          value: data[0].endOfDayPrices.price,
          color: '#7B7B7D',
          dashStyle: 'Dot',
          width: 1,
          id: 'plot-line-yesterdayClose'
        })
      })
    };

    });
  }

  getYesterdayClose(callback) {
    axios.get(`/stocks/${this.props.ticker}/yesterdayClose/`)
      .then(({data}) => {callback(data)});
  }

  illuminateAllSeries(boolean) {
    var allSeries = document.getElementsByClassName('highcharts-series');
    for (var i = 0; i < allSeries.length; i++) {
      var element = allSeries[i].getElementsByClassName('highcharts-graph')[0];
      if (element) {
        if (boolean) {
          element.classList.remove('unfocused');
        } else {
          element.classList.add('unfocused');
        }
      };
    };
  }

  illuminteOneLine(index) {
    var allSeries = document.getElementsByClassName('highcharts-series');
    var selectedSeries = allSeries[index].getElementsByClassName('highcharts-graph')[0];
    selectedSeries.classList.remove('unfocused');
  }

  componentDidMount() {
    var setChangeCaption = this.props.setChangeCaption;
    var setSelectedPrice = this.props.setSelectedPrice;
    var selectedGraph = this.props.selectedGraph;
    var tooltipY = this.props.tooltipY;

    this.chart = Highcharts.chart('graph', {

      chart: {
        type: 'line',
        backgroundColor: '#1b1b1d',
        spacingLeft: -55,
        events: {
          load: this.loadData
        }
      },

      series: [
        { name: 'cat1', data: [] },
        { name: 'cat2', data: [] },
        { name: 'cat3', data: [] },
        { name: 'cat4', data: [] },
        { name: 'cat5', data: [] },
        { name: 'uncategorized', data: [] }
    ],

      plotOptions: {
        series: {
          animation: false,
          events: {
            mouseOver: (e) => {
              this.illuminateAllSeries(false);
              this.illuminteOneLine(e.target.index);
            }
          },
          marker: {
            enabled: false,
            symbol: 'circle',
            states: {
              hover: {
                fillColor: '#21ce99',
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
          return {x: point.plotX - 43, y: tooltipY};
        },
        formatter: function() {
          // Set value for selectedPrice component
          setSelectedPrice(this.point.y);

          // if series is Pre-market or After hours, display that as caption
          // Otherwise, set caption to blank
          if (selectedGraph === '1D' && this.series.index === 0) {
            setChangeCaption('Pre-Market');
          } else if (selectedGraph === '1D' && this.series.index === 2) {
            setChangeCaption('After Hours');
          } else {
            setChangeCaption('');
          }

          // Set format of tooltip
          var date = new Date(this.point.name);
          if (selectedGraph === '1W') {
            date = (date.toLocaleTimeString('en-us', {hour: 'numeric', minute: '2-digit'}) + ', ' + date.toLocaleDateString('en-us', {month: 'short', day:'numeric'}) + ' ET').toUpperCase();
          } else if (selectedGraph === '1D') {
            date = date.toLocaleTimeString('en-us', {hour: 'numeric', minute: '2-digit'}) + ' ET';
          } else {
            date = date.toLocaleDateString('en-us', {month: 'short', day: 'numeric', year: 'numeric'}).toUpperCase();
          }
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
        visible: true
      }
    });
  }

  render() {
    return (
      <div id='container' onMouseLeave={() => { this.props.handleMouseLeaveChart(); this.illuminateAllSeries(true);}}>
        <div id='graph'>Chart Goes HereX</div>
      </div>
    );
  }
}

export default Chart5y;
