var mongoose = require('mongoose');
var faker = require('faker');

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
  last1dPrices: [
    {
      priceType: String,
      datetime: Date,
      price: Number
    }
  ],
  last1wPrices: [
    {
      datetime: Date,
      price: Number
    }
  ],
  last1yPrices: [
    {
      datetime: Date,
      price: Number
    }
  ],
  last5yPrices: [
    {
      datetime: Date,
      price: Number
    }
  ]
});

var Stock = mongoose.model('Stock', stock);

Stock.listAll = () => {
  // Returns a Promise object which resolves to a list of all stocks in the collection.
  return Stock.find({}, 'ticker name');
};

Stock.getInfo = ticker => {
  // Returns a Promise object which resolves to basic info for the stock matching the provided ticker.
  return Stock.findOne(
    {ticker: ticker}, 
    'ticker name analystBuy platformOwners');
};

Stock.get1dPrices = ticker => {
  // Returns a Promise object which resolves to 1d price history for the stock matching the provided ticker.
  return Stock.findOne(
    {ticker: ticker}, 
    {'last1dPrices': 1});
};

Stock.get1wPrices = ticker => {
  // Returns a Promise object which resolves to 1w price history for the stock matching the provided ticker.
  return Stock.findOne(
    {ticker: ticker}, 
    {'last1wPrices': 1});
};

Stock.get1mPrices = ticker => {
  // Returns a Promise object which resolves to 1m price history for the stock matching the provided ticker.
  return Stock.aggregate([
    {
      $match: {ticker: ticker}
    },
    {
      $unwind: "$prices"
    }
  ]);
};


var randPrice = (priceType, datetime, refPrice, maxChangeFactor)=> {
  // Returns a price object with a randomly generated price based on the refPrice and maxChangeFactor.

  // Accepts the following arguments: 
    // priceType: Optional string representing the type property for the price object. This property does not get assigned if type is undefined
    // datetime: Date that will get assigned to the price object
    // refPrice: The reference price you want to use to produce this new random price
    // maxChangeFactor: Calculates the output price based on a max swing of this multiple (e.g. if maxChangeFactor is 0.1, the output price can be 0.9x to 1.1x of the refPrice). Cannot go below zero.

  var price = Math.max(refPrice * (1 + maxChangeFactor * (Math.random() - 0.5) / 0.5), 0);
  var priceObj = {
    datetime: datetime,
    price: price
  };
  if (priceType) {
    priceObj.priceType = priceType;
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
    last1dPrices: [Object.assign({priceType: latestPriceObjType}, latestPriceObj)],
    last1wPrices: [latestPriceObj],
    last1yPrices: [latestPriceObj],
    last5yPrices: [latestPriceObj],
  };

  // Populate last5y prices
  for (var i = 0; i < 52 * 5 - 1; i++) {
    var lastPrice = newStock.last5yPrices[newStock.last5yPrices.length - 1].price;
    var newDateTime = new Date(newStock.last5yPrices[newStock.last5yPrices.length - 1].datetime);
    newDateTime.setDate(newDateTime.getDate() - 7);
    newStock.last5yPrices.push(randPrice(undefined, newDateTime, lastPrice, 0.02));
  }

  // Populate last1y prices
  for (var i = 0; i < 365 - 1; i++) {
    var lastPrice = newStock.last1yPrices[newStock.last1yPrices.length - 1].price;
    var newDateTime = new Date(newStock.last1yPrices[newStock.last1yPrices.length - 1].datetime);
    newDateTime.setDate(newDateTime.getDate() - 1);
    newStock.last1yPrices.push(randPrice(undefined, newDateTime, lastPrice, 0.02));
  }

  // Populate last1w prices
  for (var i = 0; i < 40 * 5 - 1 ; i++) {
    var lastPrice = newStock.last1wPrices[newStock.last1wPrices.length - 1].price;
    var newDateTime = new Date(newStock.last1wPrices[newStock.last1wPrices.length - 1].datetime);
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
    newStock.last1wPrices.push(randPrice(undefined, newDateTime, lastPrice, 0.02));
  }

  // Populate last1d prices
  var dayStart = new Date(latestMarketDateTime);
  dayStart.setHours(9);
  dayStart.setMinutes(0);
  var dataPoints = (latestMarketDateTime - dayStart) / (5 * 60 * 1000);
  for (var i = 0; i < dataPoints ; i++) {
    var lastPrice = newStock.last1dPrices[newStock.last1dPrices.length - 1].price;
    var newDateTime = new Date(newStock.last1dPrices[newStock.last1dPrices.length - 1].datetime);
    if (newDateTime.getHours() > 16) {
      newDateTime.setHours(16);
      newDateTime.setMinutes(0);
    } else {
      newDateTime.setMinutes(newDateTime.getMinutes() - 5);
    }
    newStock.last1dPrices.push(randPrice(hoursType(newDateTime), newDateTime, lastPrice, 0.02));

  }

  return newStock;
};

/*var testStock = {
  ticker: 'TEST',
  name: 'Testing Co',
  analystBuy: 0.31,
  platformOwners: 8888,
  prices: {
    last1d: [{datetime: new Date, price: 101.98918793847282, priceType: 'Normal'}],
    last1w: [{datetime: new Date, price: 99.03624194022998}],
    last1y: [[{datetime: new Date, price: 99.03624194022998}]],
    last5y: [[{datetime: new Date, price: 99.03624194022998}]],
  }
};*/


var generateTicker = str => {
  var ticker = '';
  var strArray = str.split(' ');
  for (var i = 0; i < 4; i++) {
    ticker += strArray[i][0];
  }
  return ticker;
};

var createRandomStocks = (num, latestDateTime) => {
  // Returns an array of random stock objects of size num, with the latest price data point at latestDateTime.

  var array = [];
  var tickers = new Set;

  var createRandomCompany = () => {
    var company = {};
    company.name = faker.commerce.productName() + ' ' + faker.address.state();
    company.ticker = generateTicker(company.name);
    return company;
  };

  for (var i = 0; i < num; i++) {
    var company = createRandomCompany();
    while (tickers.has(company.ticker)) {
      company = createRandomCompany();
    }
    tickers.add(company.ticker);
    array.push(createRandomStock(company.ticker, company.name, Math.random().toFixed(2), Math.round(Math.random() * 500000), faker.commerce.price(), latestDateTime));
  }

  return array;
};


Stock.estimatedDocumentCount({})
  .then(dbItemCount => { 
    console.log('Items in db.stocks: ', dbItemCount);
    if (dbItemCount < 90) {
      Stock.insertMany(createRandomStocks(100, new Date), err => { console.log('DB seeding triggered. Seeding errors:', err); });
    }
  });

module.exports = Stock;