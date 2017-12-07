'use strict'

module.exports = {
    console: {
        limit: 150,
        charSpance: '='
    },
    mongo: {
        server: 'localhost',
        port: 27017,
        database: 'poloniex',
        status: false,
        command: 'mongod --dbpath',
        path: 'c:/mongo'
    },
    firebase: {
        serverKey: 'AAAAnOm1D1c:APA91bHQNPOelvZjamglKSAGPCOl5NKl2Nh-i7vMe5G1vYLT3r16LwcR7Y-YMm4SdwKZ9VewW1pCP_IRu_A5tc39pCVziZF19zSKksmPnrCzayP-ie-OZXzxNT__NcstvykhTPh7Nyir'
    },
    express: {
        port: 8000
    },
    sockets: {
        port: 8002
    },
    poloniex: {
        url: 'https://poloniex.com/public?command=returnTicker'
    },
    getMongoCommand: (mongo) => {
        return mongo.command + ' "' + mongo.path + '"';
    }
}
