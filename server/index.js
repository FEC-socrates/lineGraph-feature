const express = require('express');
const path = require('path');
const app = express();
const expressStaticGzip = require("express-static-gzip");
const port = process.env.PORT || 3456;
var stocks = require('../db/stock');


// ===========================================
// ALLOW CORS
// ===========================================

var allowCORS = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
};

app.use(allowCORS);


// ============================================
// HANDLE API ENDPOINTS
// ============================================

// GET /stocks returns a list of all stocks
app.get('/stocks/', (req, res) => {
  stocks.listAll()
    .then(results => { res.send(JSON.stringify(results)); });
});

// GET /stocks/:ticker/ returns basic info about a stock
app.get('/stocks/:ticker', (req, res) => {
  stocks.getInfo(req.params.ticker)
    .then(results => { res.send(JSON.stringify(results)); });
});


// GET /stocks/:ticker/yesterdayClose returns yesterday's close price for a stock
app.get('/stocks/:ticker/yesterdayClose', (req, res) => {
  stocks.getYesterdayClose(req.params.ticker)
    .then(results => { res.send(JSON.stringify(results)); });
});


// GET /stocks/:ticker/last1dPrices returns relevant price history for a stock
app.get('/stocks/:ticker/last1dPrices', (req, res) => {
  stocks.get1dPrices(req.params.ticker)
    .then(results => { res.send(JSON.stringify(results)); });
});


// GET /stocks/:ticker/last1wPrices returns relevant price history for a stock
app.get('/stocks/:ticker/last1wPrices', (req, res) => {
  stocks.get1wPrices(req.params.ticker)
    .then(results => { res.send(JSON.stringify(results)); });
});

// GET /stocks/:ticker/last1mPrices returns relevant price history for a stock
app.get('/stocks/:ticker/last1mPrices', (req, res) => {
  stocks.get1mPrices(req.params.ticker)
    .then(results => { res.send(JSON.stringify(results)); });
});

// GET /stocks/:ticker/last3mPrices returns relevant price history for a stock
app.get('/stocks/:ticker/last3mPrices', (req, res) => {
  stocks.get3mPrices(req.params.ticker)
    .then(results => { res.send(JSON.stringify(results)); });
});

// GET /stocks/:ticker/last1yPrices returns relevant price history for a stock
app.get('/stocks/:ticker/last1yPrices', (req, res) => {
  stocks.get1yPrices(req.params.ticker)
    .then(results => { res.send(JSON.stringify(results)); });
});

// GET /stocks/:ticker/last5yPrices returns relevant price history for a stock
app.get('/stocks/:ticker/last5yPrices', (req, res) => {
  stocks.get5yPrices(req.params.ticker)
    .then(results => { res.send(JSON.stringify(results)); });
});

// ===========================================
// IF NOT API ENDPOINTS, SERVE STATIC FILES
// ===========================================

var logAcceptEncoding = (req, res, next) => {
  console.log('Requst accept-encoding: --->', req.get('accept-encoding'));
  next();
}

var expressStaticGzipOptions = {
  enableBrotli: true,
  orderPreference: ['br']
};

// Route any path with pattern /number/ to the public directory
app.use(/\/\d+\//, logAcceptEncoding, expressStaticGzip('./public', expressStaticGzipOptions));
// Else handle root requests
app.use('/', logAcceptEncoding, expressStaticGzip('./public', expressStaticGzipOptions));


// ============================================
// START THE SERVER
// ============================================

app.listen(port, () => console.log('server is listening on port ' + port));
