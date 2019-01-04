var mongoose = require('mongoose');

var mongo = process.env.MONGODB || 'mongodb://localhost/robinshood_lineGraph';

// ============================================
// ESTABLISHING DB 
// ============================================

// Connect to DB. Use db if exists, else create db.
mongoose.connect(mongo);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to db!');
});

var Schema = mongoose.Schema;


module.exports = Schema;
