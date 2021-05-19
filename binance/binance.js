const Binance = require('node-binance-api');
const config = require('config');
const Configurations = require('../configuration/configuration.dao');
const utils = require('../utils');


const APIKEY = config.get("binance").APIKEY
const APISECRET = config.get("binance").APISECRET



const binance = new Binance().options({
    APIKEY,
    APISECRET
});

module.exports = binance
