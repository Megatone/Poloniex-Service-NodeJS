'use strict'

module.exports = (settings, c) => {

    const FCM = require('fcm-node');
    const fcm = new FCM(settings.firebase.serverKey);
    const SubscriptionController = require('../controllers/subscriptionController');

    module.checkNotificacions = (ticks) => {
        try {
            let now = new Date().getTime();
            SubscriptionController.getActiveSubscriptionsNotNotified(now).then(subscriptions => {
                if (subscriptions) {
                    for (var i = 0; i <= ticks.length - 1; i++) {
                        let tick = ticks[i];
                        let subscriptionFiltered = subscriptions.filter(s => s.pair.tag === tick.pair.tag);
                        for (var x = 0; x <= subscriptionFiltered.length - 1; x++) {
                            let subscription = subscriptionFiltered[x];
                            let sendNotification = false;
                            let notificationMessage = '';
                            switch (subscription.type) {
                                case '$>':
                                    sendNotification = (parseFloat(tick.lastPrice) > parseFloat(subscription.value));
                                    notificationMessage = tick.lastPrice;
                                    break;
                                case '$<':
                                    sendNotification = (parseFloat(tick.lastPrice) < parseFloat(subscription.value));
                                    notificationMessage = tick.lastPrice;
                                    break;
                                case '%>':

                                    sendNotification = (parseFloat(tick.percentChange) > parseFloat(subscription.value))
                                    notificationMessage = tick.percentChange
                                    break;
                                case '%<':
                                    sendNotification = (parseFloat(tick.percentChange) < parseFloat(subscription.value))
                                    notificationMessage = tick.percentChange
                                    break;
                                default:
                                    break;
                            }
                            if (sendNotification === true && subscription.notified === false) {
                                sendNotification(subscription, notificationMessage);
                            } else if (sendNotification === false && subscription.notified === true) {
                                SubscriptionController.updateNotified(subscription, false);
                            }
                        }
                    }
                }
            });
        } catch (err) {
            console.log('notificationService checkNotifications');
        }
    }

    function sendNotification(subscription, notificationMessage) {
        var message = generateNotification(subscription, notificationMessage);
        fcm.send(message, function (err, response) {
            if (err) {
                c.danger(JSON.stringify(err));
            } else {
                SubscriptionController.updateNotified(subscription, true);
                c.success(JSON.stringify(response).replace("\\", ""));
            }
        });
    }

    function generateNotification(subscription, notificationMessage) {
        return {
            to: subscription.device.token,
            notification: {
                title: 'Poloniex Notification',
                body: notificationMessage,
                sound: 'default'
            },
            data: {
                title: 'Poloniex Notification',
                body: notificationMessage,
                sound: 'default'
            }
        };
    }

    return module;
}