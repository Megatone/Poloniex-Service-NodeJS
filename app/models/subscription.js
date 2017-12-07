'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubscriptionSchema = Schema({
    device: {
        type: Schema.ObjectId,
        ref: 'Device'
    },
    pair: {
        type: Schema.ObjectId,
        ref: 'Pair'
    },
    value: Number,
    status: Boolean,
    type: String,
    lastNotification: Number
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);   