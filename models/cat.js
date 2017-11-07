var mongoose = require('mongoose');

var CatSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  }
});

var Cat = mongoose.model('Cat', CatSchema);

module.exports = Cat;
