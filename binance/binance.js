const Binance = require('node-binance-api');
const config = require('config');
const Configurations = require('../configuration/configuration.dao');





const getCreds = async () => {
    const conf = await Configurations.findDocument()
    return conf
}
const conf = getCreds()
const APIKEY = conf.APIKEY
const APISECRET = conf.APISECRET
const binance = new Binance().options({
    APIKEY,
    APISECRET
});

module.exports = binance
