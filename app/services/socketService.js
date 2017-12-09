'use strict'

module.exports = (app, settings, c) => {

    const server = require('http').Server(app);
    const io = require('socket.io')(server);
    const DeviceController = require('../controllers/deviceController');
    const SubscriptionController = require('../controllers/subscriptionController');
    module.ticks = [];

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

            socket.on('join-channel', (channel) => {
                socket.leave('channel-2-BTC');
                socket.leave('channel-2-XMR');
                socket.leave('channel-2-ETH');
                socket.leave('channel-2-USDT');

                socket.leave('channel-10-BTC');
                socket.leave('channel-10-XMR');
                socket.leave('channel-10-ETH');
                socket.leave('channel-10-USDT');

                socket.leave('channel-30-BTC');
                socket.leave('channel-30-XMR');
                socket.leave('channel-30-ETH');
                socket.leave('channel-30-USDT');

                socket.join(channel);
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

    module.emitChannel = (channel) => {
        if (io.engine.clientsCount > 0) {
            emitTicks(channel, 'BTC');
            emitTicks(channel, 'ETH');
            emitTicks(channel, 'XMR');
            emitTicks(channel, 'USDT');
        }
    };

    function emitTicks(channel, main) {
        let finalChannel = channel + '-' + main;
        let room = io.nsps['/'].adapter.rooms[finalChannel];
        let clientsInRoom = 0;
        if (room)
            clientsInRoom = room.sockets ? Object.keys(room.sockets).length : 0;
        if (clientsInRoom > 0) {
            let _ticks = module.ticks.filter((t) => t.pair.main === main);
            io.sockets.to(finalChannel).emit('ticks', _ticks);
            c.emit('Emit ticks on channel "' + finalChannel + '" to ' + clientsInRoom + ' clients');
        }
    }
    return module;
}