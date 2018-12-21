var mongoose = require('mongoose');

// use db if exists, else create db
mongoose.connect('mongodb://localhost/robinshood_lineGraph');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to db!');
});

var Schema = mongoose.Schema;

var stock = new mongoose.Schema({
  ticker: String,
  name: String,
  analystBuy: Number,
  platformOwners: Number,
  prices: [
    {
      last1d: [
        {
          type: String,
          datetime: Date,
          price: Number
        }
      ],
      last1w: [
        {
          datetime: Date,
          price: Number
        }
      ],
      last1y: [
        {
          datetime: Date,
          price: Number
        }
      ],
      last5y: [
        {
          datetime: Date,
          price: Number
        }
      ],
    }
  ]
});

var randPrice = (type, datetime, refPrice, maxChangeFactor)=> {
  // Returns a price object with a randomly generated price based on the refPrice and maxChangeFactor.

  // Accepts the following arguments: 
    // type: Optional string representing the type property for the price object. This property does not get assigned if type is undefined
    // datetime: Date that will get assigned to the price object
    // refPrice: The reference price you want to use to produce this new random price
    // maxChangeFactor: Calculates the output price based on a max swing of this multiple (e.g. if maxChangeFactor is 0.1, the output price can be 0.9x to 1.1x of the refPrice). Cannot go below zero.

  var price = Math.max(refPrice * (1 + maxChangeFactor * (Math.random() - 0.5) / 0.5), 0);
  var priceObj = {
    datetime: datetime,
    price: price
  };
  if (type) {
    priceObj.type = type;
  }
  return priceObj;
};

// For simplicity, no bearing between 1d/1w/1y/5y. Doesn't assume any market offdays.
// Use insertMany
// for 100 loops
  // set random time between market hours
  // set currentPrice
  // build last1d (includes 9am-930am premarket, 4-6p afterhours)
    // if time > premarket start, gen premarket
    // if time > normal start, gen normal
    // if time > afterhours start, gen afterhours
  // build last1w (260 data points) (normal hours only; 9:30am - 4pm daily)
  // build last1y (365 data points)
  // build last5y (260 data points)

var hoursType = datetime => {
  // Returns as a string, whether the time provided is during market Normal hours, After Hours or Pre-Market.

  if (datetime.getHours() >= 16) {
    return 'After Hours';
  } else if (datetime.getHours() > 9) {
    return 'Normal';
  } else if (datetime.getHours() === 9 && datetime.getMinutes() >= 30) {
    return 'Normal';
  } else {
    return 'Pre-Market';
  }
};

var createRandomStock = (ticker, name, analystBuy, platformOwners, latestPrice, latestDateTime) => {
  // Returns a stock object with provided properties and a randomly generated historical set of prices

  // Accepts the following arguments: 
    // ticker: String of stock ticker
    // name: String of company name
    // analystBuy: 0.00 - 1.00 number representing the % of analysts who rated this stock a buy
    // platformOwners: Integer representing the # of ppl on our platform who own the stock
    // latestPrice: Number representing the current price of the stock. This will be used as a basis for generating random historical prices.
    // latestDateTime: Datetime representing the latest price update for the stock. Datetimes for historical prices will work backwards from this parameter.

  var latestMarketDateTime = new Date(latestDateTime);
  if (latestMarketDateTime.getHours() > 18) {
    latestMarketDateTime.setHours(18);
    latestMarketDateTime.setMinutes(0);
  } else if (latestMarketDateTime.getHours() < 9) {
    latestMarketDateTime.setDate(latestMarketDateTime.getDate() - 1);
    latestMarketDateTime.setHours(18);
    latestMarketDateTime.setMinutes(0);
  } 

  var latestPriceObj = randPrice(undefined, latestMarketDateTime, latestPrice, 0);
  var latestPriceObjType;
  latestPriceObjType = hoursType(latestMarketDateTime);

  var newStock = {
    ticker: ticker,
    name: name,
    analystBuy: analystBuy,
    platformOwners: platformOwners,
    prices: {
      last1d: [Object.assign({type: latestPriceObjType}, latestPriceObj)],
      last1w: [latestPriceObj],
      last1y: [latestPriceObj],
      last5y: [latestPriceObj],
    }
  };

  // Populate last5y prices
  for (var i = 0; i < 52 * 5 - 1; i++) {
    var lastPrice = newStock.prices.last5y[newStock.prices.last5y.length - 1].price;
    var newDateTime = new Date(newStock.prices.last5y[newStock.prices.last5y.length - 1].datetime);
    newDateTime.setDate(newDateTime.getDate() - 7);
    newStock.prices.last5y.push(randPrice(undefined, newDateTime, lastPrice, 0.02));
  }

  // Populate last1y prices
  for (var i = 0; i < 365 - 1; i++) {
    var lastPrice = newStock.prices.last1y[newStock.prices.last1y.length - 1].price;
    var newDateTime = new Date(newStock.prices.last1y[newStock.prices.last1y.length - 1].datetime);
    newDateTime.setDate(newDateTime.getDate() - 1);
    newStock.prices.last1y.push(randPrice(undefined, newDateTime, lastPrice, 0.02));
  }

  // Populate last1w prices
  for (var i = 0; i < 40 * 5 - 1 ; i++) {
    var lastPrice = newStock.prices.last1w[newStock.prices.last1w.length - 1].price;
    var newDateTime = new Date(newStock.prices.last1w[newStock.prices.last1w.length - 1].datetime);
    if (newDateTime.getHours() > 16) {
      newDateTime.setHours(16);
      newDateTime.setMinutes(0);
    } else if (newDateTime.getHours() < 9 || newDateTime.getHours() === 9 && newDateTime.getMinutes() < 40) {
      newDateTime.setDate(newDateTime.getDate() - 1);
      newDateTime.setHours(16);
      newDateTime.setMinutes(0);
    } else {
      newDateTime.setMinutes(newDateTime.getMinutes() - 10);
    }
    newStock.prices.last1w.push(randPrice(undefined, newDateTime, lastPrice, 0.02));
  }

  // Populate last1d prices
  debugger;
  var dayStart = new Date(latestMarketDateTime);
  dayStart.setHours(9);
  dayStart.setMinutes(0);
  var dataPoints = (latestMarketDateTime - dayStart) / (5 * 60 * 1000);
  for (var i = 0; i < dataPoints ; i++) {
    var lastPrice = newStock.prices.last1d[newStock.prices.last1d.length - 1].price;
    var newDateTime = new Date(newStock.prices.last1d[newStock.prices.last1d.length - 1].datetime);
    if (newDateTime.getHours() > 16) {
      newDateTime.setHours(16);
      newDateTime.setMinutes(0);
    } else {
      newDateTime.setMinutes(newDateTime.getMinutes() - 5);
    }
    newStock.prices.last1d.push(randPrice(hoursType(newDateTime), newDateTime, lastPrice, 0.02));

  }

  return newStock;
};
