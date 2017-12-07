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
                    //console.log('Emit Ticks => ' + ticks.length);
                    SocketService.ticks = ticks;
                    SocketService.emitTicks('ticks-1');
                    let now = new Date().getTime();
                    if (SocketService.lastTick5sec < (now - 5000)) {
                        SocketService.lastTick5sec = now;
                        SocketService.emitTicks('ticks-5');
                        console.log('emit ticks 5');
                    }
                    if (SocketService.lastTick30sec < (now - 30000)) {
                        SocketService.lastTick30sec = now;
                        SocketService.emitTicks('ticks-30');
                        console.log('emit ticks 30');
                    }

                }
            });
        } catch (err) {
            console.log('poloniexService getTicks');
        }
    }
    return module;
}