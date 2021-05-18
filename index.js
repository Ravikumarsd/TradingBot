const express = require("express");
const config = require("config")

const db = require("./config/database");
const MFI_SAR_HEIKINASHI = require("./strategies/mfisarheikinashi");

const port = config.get("app").port
const app = express();
const cron = require('node-cron');
const BinanceFutures = require("./binance/binance.futures");
const binance = require("./binance/binance");
const utils = require("./utils");
const Portfolios = require("./portfolio/portfolio.dao");
const Trades = require("./trades/trades.dao");

db()

const server = app.listen(port, async () => {
    console.log(`Listening to requests on https://localhost:${port}`);
    startSchedule()
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server closed due to application termination')
        process.exit(0)
    })
});

let cronScheduleHandle = null

const startSchedule = () => {
    cronScheduleHandle = cron.schedule('*/5 * * * * *', async () => {
        const symbol = "DOT/USDT"
        console.log("running node cron...@", Date.now())
        MFI_SAR_HEIKINASHI.getMultipleIndicators(symbol)
        // binance.checkServerTime()
        // console.log("adjustLeverageResp ===>>", adjustLeverageResp)
        // BinanceFutures.getBinanceFuturesAccount()



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




