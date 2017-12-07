'use strict'

module.exports = (settings, c) => {

    const FCM = require('fcm-node');
    const fcm = new FCM(settings.firebase.serverKey);
    const SubscriptionController = require('../controllers/subscriptionController');

    module.checkNotificacions = (ticks) => {
        try {
            let now = new Date().getTime();
            SubscriptionController.getActiveSubscriptions(now).then(subscriptions => {
                if (subscriptions) {
                    for (var i = 0; i <= ticks.length - 1; i++) {
                        let tick = ticks[i];
                        let subscriptionFiltered = subscriptions.filter(s => s.pair.tag === tick.pair.tag);
                        for (var x = 0; x <= subscriptionFiltered.length - 1; x++) {
                            let subscription = subscriptionFiltered[x];
                            switch (subscription.type) {
                                case '$>':
                                    if (parseFloat(tick.lastPrice) > parseFloat(subscription.value))
                                        sendNotificacion(subscription, tick.lastPrice, now);
                                    break;
                                case '$<':

                                    if (parseFloat(tick.lastPrice) < parseFloat(subscription.value))
                                        sendNotificacion(subscription, tick.lastPrice, now);
                                    break;
                                case '%>':

                                    if (parseFloat(tick.percentChange) > parseFloat(subscription.value))
                                        sendNotificacion(subscription, tick.percentChange, now);
                                    break;
                                case '%<':
                                    if (parseFloat(tick.percentChange) < parseFloat(subscription.value))
                                        sendNotificacion(subscription, tick.percentChange, now);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
            });
        } catch (err) {
            console.log('notificationService checkNotifications');
        }
    }

    function sendNotificacion(subscription, text, now) {
        var message = generateNotification(subscription, text);
        fcm.send(message, function (err, response) {
            if (err) {
                c.danger(JSON.stringify(err));
            } else {
                SubscriptionController.updateLastNotification(subscription._id, now);
                c.success(JSON.stringify(response).replace("\\", ""));
            }
        });
    }

    function generateNotification(subscription, text) {
        return {
            to: subscription.device.token,
            notification: {
                title: 'Poloniex Notification',
                body: text
            },
            data: {
                title: 'Poloniex Notification',
                body: text
            },
            sound: 'default'
        };
    }

    return module;
}