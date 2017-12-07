'use strict'

module.exports = (settings, c) => {

    const express = require('express');
    const app = express();

    const SocketService = require('./services/socketService')(app, settings, c);
    const NotificationService = require('./services/notificationService')(settings, c);
    const PoloniexService = require('./services/poloniexService')(SocketService ,NotificationService , settings, c);


    module.init = () => {
        SocketService.initSocketService();
        PoloniexService.initService();
    }

    return module;
}