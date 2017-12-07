'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PairSchema = Schema({   
    main: String,
    tag: String
});

module.exports = mongoose.model('Pair', PairSchema);   