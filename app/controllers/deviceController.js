'use strict'

const Device = require('../models/device');

function upsert(device) {
    return Device.findOneAndUpdate({ uuid: device.uuid }, { token: device.token, refresh: device.refresh }, { new: true, upsert: true }).exec();
}

module.exports = {
    upsert
}