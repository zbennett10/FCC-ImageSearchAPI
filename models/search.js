var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var searchSchema = new Schema({
  searchTerm: String,
  timestamp: Number
});

module.exports = mongoose.model('Search', searchSchema);