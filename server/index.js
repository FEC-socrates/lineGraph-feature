const express = require('express');
const app = express();
const port = 3456;
var stocks = require('../db/config');

// GET /stocks returns a list of all stocks
app.get('/stocks/', (req, res) => {
  stocks.listAll()
    .then(results => { res.send(JSON.stringify(results)); });
});

// GET /stocks/:ticker/ returns basic info about a stock
app.get('/stocks/:ticker', (req, res) => {
  console.log(req.method, req.path, req.body, req.params.ticker);
  stocks.getInfo(req.params.ticker)
    .then(results => { res.send(JSON.stringify(results)); });
});

// GET /stocks/:ticker/last1dPrices returns relevant price history for a stock
app.get('/stocks/:ticker/last1dPrices', (req, res) => {
  console.log(req.method, req.path, req.body, req.params.ticker);
  stocks.get1dPrices(req.params.ticker)
    .then(results => { res.send(JSON.stringify(results)); });
});


// GET /stocks/:ticker/last1wPrices returns relevant price history for a stock
app.get('/stocks/:ticker/last1wPrices', (req, res) => {
  console.log(req.method, req.path, req.body, req.params.ticker);
  stocks.get1wPrices(req.params.ticker)
    .then(results => { res.send(JSON.stringify(results)); });
});

// GET /stocks/:ticker/last1mPrices returns relevant price history for a stock
app.get('/stocks/:ticker/last1mPrices', (req, res) => {
  console.log(req.method, req.path, req.body, req.params.ticker);
  stocks.get1mPrices(req.params.ticker)
    .then(results => { res.send(JSON.stringify(results)); });
});

// GET /stocks/:ticker/last1yPrices returns relevant price history for a stock
app.get('/stocks/:ticker/last1yPrices', (req, res) => {
  console.log(req.method, req.path, req.body);
  res.send(`${req.method} received for ${req.path}. Routing is pending implementation.`);
});

// GET /stocks/:ticker/last5yPrices returns relevant price history for a stock
app.get('/stocks/:ticker/last5yPrices', (req, res) => {
  console.log(req.method, req.path, req.body);
  res.send(`${req.method} received for ${req.path}. Routing is pending implementation.`);
});

app.listen(port, () => console.log('server is listening!'));