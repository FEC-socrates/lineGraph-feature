var mongoose = require('mongoose');


// ============================================
// ESTABLISHING DB 
// ============================================

// Connect to DB. Use db if exists, else create db.
mongoose.connect('mongodb://localhost/robinshood_lineGraph');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to db!');
});

var Schema = mongoose.Schema;


module.exports = Schema;