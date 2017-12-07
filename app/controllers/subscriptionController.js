'use strict'

const Subscription = require('../models/subscription');
const Pair = require('../models/pair');

function getSubscriptionsByDeviceId(deviceId) {
    return Subscription.find({ device: deviceId }).populate({ path: 'pair' }).exec();
}

function upsert(subscription) {
    try {
        return Pair.findOne({ tag: subscription.pair.tag }, (err, pairSearched) => {
            if (!err && pairSearched)
                return Subscription.findOneAndUpdate(
                    { device: subscription.device, type: subscription.type, pair: pairSearched._id },
                    {
                        device: subscription.device,
                        pair: pairSearched._id,
                        value: subscription.value,
                        status: subscription.status,
                        type: subscription.type,
                        lastNotification: subscription.lastNotification,
                        notified: false
                    },
                    { new: true, upsert: true }).exec();
        });
    }
    catch (err) {
        console.log('SubscriptionController upsert');
    }
}

function getActiveSubscriptions(nowTimestamp) {
    let filterLastNotification = nowTimestamp - 30000; //30 sec
    return Subscription.find({ status: true, lastNotification: { $lt: filterLastNotification } }).populate({ path: 'device' }).where('device.notificationStatus', true).populate({ path: 'pair' }).exec();
}

function updateNotified(subscription, value) {
    Subscription.findByIdAndUpdate(subscription._id, { notified: value, lastNotification: new Date().getTime() }).exec();
}

module.exports = {
    getSubscriptionsByDeviceId,
    getActiveSubscriptions,
    upsert,
    updateNotified
}