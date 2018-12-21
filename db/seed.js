var mongoose = require('mongoose');
var Stock = require('./stock');
var seed = require('./seed-helpers');


Stock.estimatedDocumentCount({})
  .then(dbItemCount => { 
    console.log('Pre-seed # of stocks: ', dbItemCount);
    Stock.insertMany(seed.createRandomStocks(100, new Date), err => { console.log('DB seeding triggered. Errors? -->', err); });
  });