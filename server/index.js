const express = require('express');
const app = express();
const port = 3456;
var db = require('../db/config');
var stocks = require('../db/stock');


// ============================================
// SERVE STATIC FILES
// ===========================================

app.use('/', express.static('../public'));

// ============================================
// ESTABLISH API ENDPOINTS
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


// ============================================
// START THE SERVER
// ============================================

app.listen(port, () => console.log('server is listening!'));