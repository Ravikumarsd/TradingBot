const Binance = require('node-binance-api');
const config = require('config');
const Configurations = require('../configuration/configuration.dao');
const utils = require('../utils');
const colors = require("colors")

const APIKEY = config.get("binance").APIKEY
const APISECRET = config.get("binance").APISECRET


const WebSocket = require('ws');

const binance = new Binance().options({
    APIKEY,
    APISECRET,
    useServerTime: true,
    recvWindow: 60000,
    verbose: true,
    reconnect: true,
    keepAlive: true,
});
const heartbeat = () => {
    this.isAlive = true;
}
const futuresCandlesNew = (symbol, interval, callback) => {
    symbol = symbol.split("/").join("")
    try {
        symbol = symbol.toLowerCase()
        const ws = new WebSocket(`wss://fstream.binance.com/stream?streams=${symbol}@kline_${interval}`);
        ws.on('connection', function connection(wss) {
            wss.isAlive = true;
            wss.on('pong', heartbeat);
        });
        ws.on('open', function open() {
            console.log(colors.green.bold([`futuresSubscribeSingle: Subscribed to ${symbol}@kline_${interval}`]))
        });
        ws.on('message', function incoming(data) {
            // console.log(data);
            callback(data)
        });
        ws.on('close', function close() {
            console.log('disconnected');
            setTimeout(() => {
                futuresCandlesNew(symbol, interval, callback)
                console.log(colors.blue.bold("Reconneting...."))
            }, 5000)
        });
        ws.onerror = function (event) {
            console.error(colors.red.bold("WebSocket error observed:", event.message));
        };
    } catch (error) {
        console.log("websocket ", error)
    }
}


binance.futuresCandlesNew = futuresCandlesNew

module.exports = binance
