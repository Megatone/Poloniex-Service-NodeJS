'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeviceSchema = Schema({
    uuid: String,
    token: String,
    refresh: Number
});

module.exports = mongoose.model('Device', DeviceSchema);   