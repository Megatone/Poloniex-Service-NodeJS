'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeviceSchema = Schema({
    uuid: String,
    token: String,
    refresh: String,
    notificationStatus : Boolean
});

module.exports = mongoose.model('Device', DeviceSchema);   