'use strict'

module.exports = (limit, charSpance) => {

    const colors = require('colors/safe');

    module.log = (message, value = null, format = true) => {
        console.log(colors.white(getDate()) + ' | ' + colors.white(message) + (value ? (format && format === true ? getFormatSpace(message, value) : '') + '=> ' + colors.white(value) : ''));
    };

    module.success = (message, value = 'OK', format = true) => {
        console.log(colors.white(getDate()) + ' | ' + colors.green(message) + (value ? (format && format === true ? getFormatSpace(message, value) : '') + '=> ' + colors.green(value) : ''));
    };

    module.info = (message, value = 'INFO', format = true) => {
        console.log(colors.white(getDate()) + ' | ' + colors.cyan(message) + (value ? (format && format === true ? getFormatSpace(message, value) : '') + '=> ' + colors.cyan(value) : ''));
    };

    module.warning = (message, value = 'WARNING', format = true) => {
        console.log(colors.white(getDate()) + ' | ' + colors.yellow(message) + (value ? (format && format === true ? getFormatSpace(message, value) : '') + '=> ' + colors.yellow(value) : ''));
    };

    module.danger = (message, value = 'DANGER', format = true) => {
        console.log(colors.white(getDate()) + ' | ' + colors.red(message) + (value ? (format && format === true ? getFormatSpace(message, value) : '') + '=> ' + colors.red(value) : ''));
    };

    module.emit = (message, value = 'EMIT', format = true) => {
        console.log(colors.white(getDate()) + ' | ' + colors.magenta(message) + (value ? (format && format === true ? getFormatSpace(message, value) : '') + '=> ' + colors.magenta(value) : ''));
    };

    module.client = (message, value = 'EMIT', format = true) => {
        console.log(colors.white(getDate()) + ' | ' + colors.blue(message) + (value ? (format && format === true ? getFormatSpace(message, value) : '') + '=> ' + colors.magenta(value) : ''));
    };

    function getDate() {
        var d = new Date();
        return d.toLocaleTimeString()
    };

    function getFormatSpace(message, value) {
        var totalLength = 11;
        if (message)
            totalLength += parseInt(message.length);
        var txt = ' [';
        for (var i = 0; i < parseInt(limit - totalLength); i++) {
            txt += charSpance;
        }
        return txt;
    };

    return module;

};