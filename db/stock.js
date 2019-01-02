var mongoose = require('mongoose');
var Schema = require('./config.js');


// ============================================
// ESTABLISHING SCHEMA
// ============================================

var stock = new mongoose.Schema({
  ticker: String,
  name: String,
  analystBuy: Number,
  platformOwners: Number,
  last1dPrices: [
    {
      _id: false,
      priceType: String,
      datetime: Date,
      price: Number
    },
  ],
  last1wPrices: [
    {
      _id: false,
      priceType: String,
      datetime: Date,
      price: Number
    }
  ],
  last1yPrices: [
    {
      _id: false,
      datetime: Date,
      price: Number
    }
  ],
  last5yPrices: [
    {
      _id: false,
      datetime: Date,
      price: Number
    }
  ]
});

var Stock = mongoose.model('Stock', stock);


// ============================================
// DEFINING STOCK DB LOOKUP METHODS
// ============================================

Stock.listAll = () => {
  // Returns a Promise object which resolves to a list of all stocks in the collection.
  return Stock.find({}, 'ticker name');
};

Stock.getInfo = ticker => {
  // Returns a Promise object which resolves to basic info for the stock matching the provided ticker.
  return Stock.findOne(
    {ticker: ticker}, 
    'ticker name analystBuy platformOwners'
  );
};

Stock.get1dPrices = ticker => {
  // Returns a Promise object which resolves to 1d price history for the stock matching the provided ticker.
  return Stock.aggregate([
    { $match: {ticker: ticker} },
    { $project: {'last1dPrices': 1, _id: 0} },
    { $unwind: '$last1dPrices' },
    { $sort: {
      'last1dPrices.datetime': 1
    } }
  ]);
};

Stock.getYesterdayClose = ticker => {
  // Returns a Promise object which resolves to yesterday's closing price for the stock matching the provided ticker.
  return Stock.aggregate([
    { $match: {ticker: ticker} },
    { $project: {'endOfDayPrices': {
      $filter: {
        input: '$last1wPrices',
        as: 'price',
        cond: {$eq: ['$$price.priceType', 'End Of Day']}
      }
    }, _id: 0} },
    { $unwind: '$endOfDayPrices' },
    { $limit: 1 }
  ]);
};

Stock.get1wPrices = ticker => {
  // Returns a Promise object which resolves to 1w price history for the stock matching the provided ticker.
  return Stock.aggregate([
    { $match: {ticker: ticker} },
    { $project: {'last1wPrices': 1, _id: 0} },
    { $unwind: '$last1wPrices' },
    { $sort: {
      'last1wPrices.datetime': 1
    } }
  ]);
};

Stock.get1mPrices = ticker => {
  // Returns a Promise object which resolves to 1m price history for the stock matching the provided ticker.
  return Stock.aggregate([
    { $match: {ticker: ticker} },
    { $project: {'last1mPrices': '$last1yPrices', _id: 0 } },
    { $unwind: '$last1mPrices' },
    { $limit: 30 },
    { $sort: {
      'last1mPrices.datetime': 1
    } }
  ]);
};

Stock.get3mPrices = ticker => {
  // Returns a Promise object which resolves to 1m price history for the stock matching the provided ticker.
  return Stock.aggregate([
    { $match: {ticker: ticker} },
    { $project: {'last3mPrices': '$last1yPrices', _id: 0 } },
    { $unwind: '$last3mPrices' },
    { $limit: 90 },
    { $sort: {
      'last3mPrices.datetime': 1
    } }
  ]);
};

Stock.get1yPrices = ticker => {
  // Returns a Promise object which resolves to 1w price history for the stock matching the provided ticker.
  return Stock.aggregate([
    { $match: {ticker: ticker} },
    { $project: {'last1yPrices': 1, _id: 0} },
    { $unwind: '$last1yPrices' },
    { $sort: {
      'last1yPrices.datetime': 1
    } }
  ]);
};

Stock.get5yPrices = ticker => {
  // Returns a Promise object which resolves to 1w price history for the stock matching the provided ticker.
  return Stock.aggregate([
    { $match: {ticker: ticker} },
    { $project: {'last5yPrices': 1, _id: 0} },
    { $unwind: '$last5yPrices' },
    { $sort: {
      'last5yPrices.datetime': 1
    } }
  ]);
};


module.exports = Stock;
