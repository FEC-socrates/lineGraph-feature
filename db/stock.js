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
      $project: {'last1yPrices': 1}
    },
    {
      $unwind: '$last1yPrices'
    },
    {
      $limit: 30
    }
  ]);
};

Stock.get3mPrices = ticker => {
  // Returns a Promise object which resolves to 1m price history for the stock matching the provided ticker.
  return Stock.aggregate([
    {
      $match: {ticker: ticker}
    },
    {
      $project: {'last1yPrices': 1}
    },
    {
      $unwind: '$last1yPrices'
    },
    {
      $limit: 90
    }
  ]);
};

Stock.get1yPrices = ticker => {
  // Returns a Promise object which resolves to 1w price history for the stock matching the provided ticker.
  return Stock.findOne(
    {ticker: ticker}, 
    {'last1yPrices': 1});
};

Stock.get5yPrices = ticker => {
  // Returns a Promise object which resolves to 1w price history for the stock matching the provided ticker.
  return Stock.findOne(
    {ticker: ticker}, 
    {'last5yPrices': 1});
};


module.exports = Stock;
