import React from 'react';
import styled from 'styled-components';
import Highcharts from 'highcharts';
import axios from 'axios';

class Chart extends React.Component {
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

  loadData(callback = () => {}) {
  // Fetches price data from the server and loads the data into Highcharts. Called by Highcharts on chart load.
    this.props.requestData(this.apiEndpoint, json => {
      // Transform the shape of the data to exactly what Highcharts requires
      var data = json.map(item => {
        // If there is no priceType property, don't add it to the data
        if (item[this.apiEndpoint].priceType) {
          return [item[this.apiEndpoint].datetime, item[this.apiEndpoint].price, item[this.apiEndpoint].priceType];
        } else {
          return [item[this.apiEndpoint].datetime, item[this.apiEndpoint].price];
        }
      });

      // Data must be loaded differently depending on the graph type to allow for differences in the graph view (e.g. highlighting portions of the graph on mouseOver)
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
          // For the 1W graph, if data point is a new day
          if (this.props.selectedGraph === '1W' && ((new Date(data[i-1][0])).getDate() !== (new Date(data[i][0])).getDate())) {
            // It should represent a new series
            series[index][i] = data[i];
            index++;
          }
          // For the 1D graph, if data point is a new priceType
          if (this.props.selectedGraph === '1D' && (data[i-1][2] !== data[i][2])) {
            // It should represent a new series
            series[index][i] = data[i];
            index++;
          }
          // Push the data to the appropriate series and data point in the series
          series[index][i] = data[i];
        }
        // Loop thru each series and load it into Highcharts
        for (var i = 0; i < series.length; i++) {
          this.chart.series[i].setData(series[i]);
        }        
      // Otherwise, for 1M, 3M, 1Y and 5Y graphs: 
      } else {
        // Dataset just lives in one series. Load that into Highcharts
        this.chart.series[5].setData(data);
      }

    // Price change captions also behave differently for the 1D graph vs other graphs
    // If graph is 1D
    if (this.props.selectedGraph === '1D') {

      // The latest available 'Today' price should be the latest of whatever Pre-Market or Normal Hour prices are available
      var latestPreMarket = this.chart.series[0].data.filter(item => !!item.y).pop();
      var latestNormal = this.chart.series[1].data.filter(item => !!item.y).pop();
      var latestTodayPrice;
      if (latestNormal) {
        latestTodayPrice = latestNormal.y;
      } else {
        latestTodayPrice = latestPreMarket.y;
      }
      this.props.setLatestPrice(latestTodayPrice);
      this.props.setSelectedPrice(latestTodayPrice);

      // The latest available 'After Hours' price also needs to be obtained
      var latestAfterHours = this.chart.series[2].data.filter(item => !!item.y).pop();
      if (latestAfterHours) {
        this.props.setLatestAfterHours(latestAfterHours.y);
      }

      // Add plotline of yesterday's close price
      this.props.getYesterdayClose(data => {
        this.chart.yAxis[0].addPlotLine({
          value: data[0].endOfDayPrices.price,
          color: '#7B7B7D',
          dashStyle: 'Dot',
          width: 1,
          id: 'plot-line-yesterdayClose'
        });

        // Set reference start price to yesterday's end of day price
        this.props.setRefStartPrice(data[0].endOfDayPrices.price);
      })
    } else {
      // For other graph types, just set the reference start price as the first data point and the latest price as the last data point
      this.props.setLatestPrice(data[data.length - 1][1]);
      this.props.setSelectedPrice(data[data.length - 1][1]);
      this.props.setRefStartPrice(data[0][1]);
    }

    // If there are any callback functions provided, invoke it.
    if (typeof callback === 'function') {
      callback();
    }

    });
  }

  illuminateAllSeries(boolean) {
  // Sets all series in the chart to be 'illuminated' or not depending on the boolean
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
  // Sets the specific series provided by the index number to be 'illuminated'
    var allSeries = document.getElementsByClassName('highcharts-series');
    var selectedSeries = allSeries[index].getElementsByClassName('highcharts-graph')[0];
    selectedSeries.classList.remove('unfocused');
  }

  componentDidMount() {
    var {
      setChangeCaption,
      setSelectedPrice,
      selectedGraph
    } = this.props;

    // Render Highcharts
    this.chart = Highcharts.chart('graph', {

      chart: {
        type: 'line',
        backgroundColor: '#1b1b1d',
        spacingLeft: -55,
        events: {
          load: this.loadData
        }
      },

      // Data without 'zones' that must be illuminated on mouseover can all be loaded into the 'uncategorized' series. Otherwise, load up to 5 'zones' that illuminate on mouseover using series cat1-cat5.
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
            // When mousing over a data series

              // Illuminate that series
              this.illuminateAllSeries(false);
              this.illuminteOneLine(e.target.index);

              // if series is Pre-market or After hours, display that as caption
              // Otherwise, set caption to blank
              if (selectedGraph === '1D' && e.target.index === 0) {
                setChangeCaption('Pre-Market');
              } else if (selectedGraph === '1D' && e.target.index === 2) {
                setChangeCaption('After Hours');
              } else {
                setChangeCaption('');
              }
            }
          },
          point: {
            events: {
              mouseOver: (e) => {
              // When mousing over a data point
                // Show value in selectedPrice component
                setSelectedPrice(e.target.y);
              }
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
          return {
            x: point.plotX - 43 + document.getElementById('container').offsetLeft, 
            y: document.getElementById('container').offsetTop
          };
        },
        formatter: function() {
          // Set format of tooltip based on the graph type
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
      <div id="container" onMouseLeave={() => { this.props.handleMouseLeaveChart(); this.illuminateAllSeries(true);}}>
        <div id="graph"></div>
      </div>
    );
  }
}

export default Chart;
