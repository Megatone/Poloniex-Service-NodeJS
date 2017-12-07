'use strict'

module.exports = () => {

    module.getTimestamp = () => {
        return new Date().getTime();
    }

    return module;
};