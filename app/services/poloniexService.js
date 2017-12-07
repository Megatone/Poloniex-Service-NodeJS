'use strict'

module.exports = (SocketService, NotificationService, settings, c) => {

    const cron = require('node-cron');
    const request = require('request');

    const cron10Sec = cron.schedule('*/2 * * * * *', () => {
        getTicks();
    }, false);

    module.initService = () => {
        cron10Sec.start();
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
                        //   c.success('Coin Price Registered successfully => ' + tick.currencyPair + ' : ' + tick.lastPrice);
                    }
                    NotificationService.checkNotificacions(ticks);
                    console.log('Emit Ticks => ' + ticks.length);
                    SocketService.emitTicks(ticks);
                }
            });
        } catch (err) {
            console.log('poloniexService getTicks');
        }
    }
    return module;
}