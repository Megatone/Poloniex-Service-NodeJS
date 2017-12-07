'use strict'

module.exports = (app, settings, c) => {

    const server = require('http').Server(app);
    const io = require('socket.io')(server);
    const DeviceController = require('../controllers/deviceController');
    const SubscriptionController = require('../controllers/subscriptionController');
    module.ticks = [];
    module.lastTick5sec = 0;
    module.lastTick30sec = 0;

    module.initSocketService = () => {
        server.listen(settings.sockets.port, () => {
            c.success("Socket IO Service Init Succesffully");
            c.info('Socket.IO Service Port "' + settings.sockets.port + '"')
        });

        io.sockets.on('connection', (socket) => {
            c.client("Client connect with socketId => " + socket.id);

            socket.on('register-device-data', (device) => {
                if (device)
                    DeviceController.upsert(device).then((deviceRegistered) => {
                        if (deviceRegistered)
                            socket.emit('response-register-device-data', deviceRegistered);
                    });
            });

            socket.on('get-subscriptions', (deviceId) => {
                if (deviceId)
                    SubscriptionController.getSubscriptionsByDeviceId(deviceId).then((subscriptions) => {
                        if (subscriptions)
                            socket.emit('response-get-subscriptions', subscriptions);
                    });
            });

            socket.on('save-subscription', (subscription) => {
                if (subscription && subscription.device) {
                    SubscriptionController.upsert(subscription).then(subscriptionSaved => {
                        if (subscriptionSaved) {
                            SubscriptionController.getSubscriptionsByDeviceId(subscription.device).then(subscriptions => {
                                socket.emit('response-save-subscription', { message: 'Push notification saved successfully', type: 'success' });
                                socket.emit('response-get-subscriptions', subscriptions);
                            });

                        } else {
                            socket.emit('response-save-subscription', { message: 'Error Push notification not saved', type: 'error' });
                        }
                    });
                } else {
                    socket.emit('response-save-subscription', { message: 'Error Push notification not saved', type: 'error' });
                }
            });

        });
    }

    module.emitTicks = (channel) => {
        if (io.engine.clientsCount > 0) {
            io.sockets.emit(channel, module.ticks);
            c.emit('Emit node information to ' + io.engine.clientsCount + ' clients width socket connection');
        }
    }

    return module;
}