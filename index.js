'use strict'

const mongoose = require('mongoose');
//const psList = require('ps-list');
const spawn = require('child-process-promise').spawn;
const settings = require('./config/settings');
const c = require('./utils/console')(settings.console.limit , settings.console.charSpance);
const app = require('./app/app')(settings, c);

//psList().then(data => {
//  if (data.filter(p => p.name == 'mongod.exe').length === 0) {
 //   var childProcess = spawn('powershell.exe', [settings.getMongoCommand(settings.mongo)]).childProcess;
  //  childProcess.stdout.on('data', (data) => {
  //    if (!settings.mongo.status) {
  //      settings.mongo.status = true;
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://' + settings.mongo.server + ':' + settings.mongo.port + '/' + settings.mongo.database, { useMongoClient: true }).then(() => {
          c.success('Application database connection with Mongo are be success');
          c.info('MongoDb Server "' + settings.mongo.server + '"');
          c.info('MongoDb Port "' + settings.mongo.port + '"');
          c.info('MongoDb Database "' + settings.mongo.database + '"');
          app.init();
        }).catch(err => {
          c.danger(err);
        });
    //  }
   // });
 // }
//});
