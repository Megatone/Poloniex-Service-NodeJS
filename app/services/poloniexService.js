'use strict'

module.exports = (SocketService, NotificationService, settings, c) => {

    const cron = require('node-cron');
    const request = require('request');

    const cron10Sec = cron.schedule('*/2 * * * * *', () => {
        getTicks();

    }, false);

    const cron5Sec = cron.schedule('*/5 * * * * *', () => {
        SocketService.emitTicks('ticks-5');
    }, false);

    const cron30Sec = cron.schedule('*/30 * * * * *', () => {
        SocketService.emitTicks('ticks-30');
    }, false);



    module.initService = () => {
        cron10Sec.start();
        cron5Sec.start();
        cron30Sec.start();
        c.success('Poloniex service init successfully');
    }

    function getTicks() {
        try {
            request(settings.poloniex.url, function (error, response, data) {
                if (!error && response.statusCode == 200) {
                    var jsonData = JSON.parse(data);
                    var ticks = Object.keys(jsonData).map(function (key) { jsonData[key].currencyPair = key; return jsonData[key]; });
                    for (var i = 0; i <= ticks.length - 1; i++) {
                        var tick = ticks[i];
                        tick.lastPrice = tick.last;
                        tick.high24 = tick.high24hr;
                        tick.low24 = tick.low24hr;
                        tick.pair = { main: tick.currencyPair.split('_')[0], tag: tick.currencyPair };
                        tick.timestamp = new Date().getTime();
                    }
                    NotificationService.checkNotificacions(ticks);
                    SocketService.ticks = ticks;
                    SocketService.emitTicks('ticks-1');
                }
            });
        } catch (err) {
            console.log('poloniexService getTicks');
        }
    }
    return module;
}