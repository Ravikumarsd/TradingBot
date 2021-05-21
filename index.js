const express = require("express");
const config = require("config")

const db = require("./config/database");
const MFI_SAR_HEIKINASHI = require("./strategies/mfisarheikinashi");

const port = config.get("app").port
const app = express();
const cron = require('node-cron');
const binance = require("./binance/binance");
const Configurations = require("./configuration/configuration.dao")
const colors = require("colors");
const BinanceSpot = require("./binance/binance.spot");
const utils = require("./utils");
const BinanceFutures = require("./binance/binance.futures");

db()
const mfi = require('trading-indicator').mfi;
const Candels = require("./candle/candle.dao");
const { json } = require("express");
const { resolve } = require("path");
const Candle = require("./candle/candle.model");


const server = app.listen(port, async () => {
    console.log(`Listening to requests on https://localhost:${port}`);
    const conf = await Configurations.findDocument()

    startSchedule(conf)
    await binance.futuresCandlesNew(conf.symbol, '1m', sendChartData);


});
function sendChartData() {
    let values = arguments[0]

    values = JSON.parse(values)

    if (values.data.k.x == true)
        Candels.createDocument(values.data.k)
}

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server closed due to application termination')
        process.exit(0)
    })
});

let cronScheduleHandle = null
const checkConnection = async (conf) => {
    // console.log("inside check connection")
    const symbol = conf.symbol
    return require('dns').resolve('www.google.com', async function (err) {
        if (err) {
            console.log("No connection");
            // binance.futuresCandlesNew(symbol, '1m', sendChartData);

        } else {
            const MFI = await BinanceFutures.getMFI(symbol)
            console.log("MFI ==>", MFI)
            if (MFI) {
                MFI_SAR_HEIKINASHI.getMultipleIndicators(symbol, MFI.MFI)
            }
            // console.log("Connected");
        }
    });
}
const startSchedule = async (conf) => {
    if (conf.botStatus == "on") {
        console.log(colors.green.bold("Bot Started"))
    } else {
        console.log(colors.red.bold("Bot Stopped"))
        return
    }
    cronScheduleHandle = cron.schedule(conf.pattern, async () => {
        console.log("running node cron...@", Date.now())
        checkConnection(conf)
    });
}

module.exports = {
    cronScheduleHandle
}




// {
//     orderId: 5272279018,
//     symbol: 'DOTUSDT',
//     status: 'NEW',
//     clientOrderId: 'HKTGJNYyecutK0WgrzYFcs',
//     price: '0',
//     avgPrice: '0.0000',
//     origQty: '0.3',
//     executedQty: '0',
//     cumQty: '0',
//     cumQuote: '0',
//     timeInForce: 'GTC',
//     type: 'MARKET',
//     reduceOnly: false,
//     closePosition: false,
//     side: 'BUY',
//     positionSide: 'BOTH',
//     stopPrice: '0',
//     workingType: 'CONTRACT_PRICE',
//     priceProtect: false,
//     origType: 'MARKET',
//     updateTime: 1621321564262
//   },
// const data = {

//     "tradeId": "g7kmw5w3mkosro8kd",
//     "symbol": "DOT/USDT",
//     "status": "close",
//     "position": "short",
//     "portfolio": 2014.2085137758186,
//     "price": 38.51549083,
//     "statusList": [
//         {
//             "symbol": "DOT/USDT",
//             "mfi": 29.475498,
//             "sar": 38.8504768,
//             "candleOpen": 38.51549083,
//             "status": "open",
//             "position": "short",
//             "portfolio": 1986.9385661778842,
//             "price": 38.51549083,
//             "createdDate": new Date("2021-05-17T15:33:11.393Z")
//         },
//         {
//             "symbol": "DOT/USDT",
//             "mfi": 27.45562462,
//             "sar": 37.86,
//             "candleOpen": 37.98688092,
//             "status": "close",
//             "position": "short",
//             "price": 37.98688092,
//             "createdDate": new Date("2021-05-17T15:45:31.501Z")
//         }
//     ],
//     "createdDate": new Date("2021-05-17T15:33:11.388Z"),
//     "__v": 0,
//     "pnl": {
//         "amount": 27.26994759793434,
//         "percent": 1.3724605310969111
//     },
//     "binanceStatusList": [
//         {
//             "orderId": 5249348886,
//             "symbol": "DOTUSDT",
//             "status": "NEW",
//             "clientOrderId": "zIm8RrBKonMurN5qacLpVK",
//             "price": "0",
//             "avgPrice": "0.0000",
//             "origQty": "0.3",
//             "executedQty": "0",
//             "cumQty": "0",
//             "cumQuote": "0",
//             "timeInForce": "GTC",
//             "type": "MARKET",
//             "reduceOnly": false,
//             "closePosition": false,
//             "side": "SELL",
//             "positionSide": "BOTH",
//             "stopPrice": "0",
//             "workingType": "CONTRACT_PRICE",
//             "priceProtect": false,
//             "origType": "MARKET",
//             "updateTime": 1621265593156
//         }
//     ]
// }


// {"code":-1013,"msg":"Filter failure: LOT_SIZE"}


// {
//     "e": "kline",     // Event type
//     "E": 123456789,   // Event time
//     "s": "BTCUSDT",    // Symbol
//     "k": {
//       "t": 123400000, // Kline start time
//       "T": 123460000, // Kline close time
//       "s": "BTCUSDT",  // Symbol
//       "i": "1m",      // Interval
//       "f": 100,       // First trade ID
//       "L": 200,       // Last trade ID
//       "o": "0.0010",  // Open price
//       "c": "0.0020",  // Close price
//       "h": "0.0025",  // High price
//       "l": "0.0015",  // Low price
//       "v": "1000",    // Base asset volume
//       "n": 100,       // Number of trades
//       "x": false,     // Is this kline closed?
//       "q": "1.0000",  // Quote asset volume
//       "V": "500",     // Taker buy base asset volume
//       "Q": "0.500",   // Taker buy quote asset volume
//       "B": "123456"   // Ignore
//     }
//   }

// k:
// B: "0"
// L: 840543944
// Q: "15860756.56114"
// T: 1621527659999
// V: "401.763"
// c: "39417.13"
// f: 840530372
// h: "39544.12"
// i: "1m"
// l: "39368.86"
// n: 13573
// o: "39373.21"
// q: "31843168.78082"
// s: "BTCUSDT"
// t: 1621527600000
// v: "806.626"
// x: false