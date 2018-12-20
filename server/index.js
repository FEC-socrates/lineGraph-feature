const express = require('express');
const app = express();
const port = 3546;
var db = require('../db/config');

app.listen(port, () => console.log('server is listening!'));