const express = require('express');
const app = express();
const port = 3456;
var stocks = require('../db/config');

// GET /stocks returns a list of all stocks
app.get('/stocks', (req, res) => {
  console.log(req.method, req.path, req.body);
  stocks.listAll()
    .then(results => { res.send(JSON.stringify(results)); });
});

// GET /stocks/:ticker/
app.get('/stocks/:id', (req, res) => {
  console.log(req.method, req.path, req.body);
  res.send(`${req.method} received for ${req.path}. Routing is pending implementation.`);
});

// GET /stocks/:ticker/prices/latest1d
app.get('/stocks:id/prices/latest1d', (req, res) => {
  console.log(req.method, req.path, req.body);
  res.send(`${req.method} received for ${req.path}. Routing is pending implementation.`);
});

// GET /stocks/:ticker/prices/latest1w
app.get('/stocks:id/prices/latest1w', (req, res) => {
  console.log(req.method, req.path, req.body);
  res.send(`${req.method} received for ${req.path}. Routing is pending implementation.`);
});

// GET /stocks/:ticker/prices/latest1m
app.get('/stocks:id/prices/latest1m', (req, res) => {
  console.log(req.method, req.path, req.body);
  res.send(`${req.method} received for ${req.path}. Routing is pending implementation.`);
});

// GET /stocks/:ticker/prices/latest1y
app.get('/stocks:id/prices/latest1y', (req, res) => {
  console.log(req.method, req.path, req.body);
  res.send(`${req.method} received for ${req.path}. Routing is pending implementation.`);
});

// GET /stocks/:ticker/prices/latest5y
app.get('/stocks:id/prices/latest5y', (req, res) => {
  console.log(req.method, req.path, req.body);
  res.send(`${req.method} received for ${req.path}. Routing is pending implementation.`);
});

app.listen(port, () => console.log('server is listening!'));