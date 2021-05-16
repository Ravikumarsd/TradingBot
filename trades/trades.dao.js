const Trade = require("./trades.model")
const uniqid = require('uniqid');
const colors = require("colors");
const utils = require("../utils");
const Portfolios = require("../portfolio/portfolio.dao");

const Trades = {}
Trades.createDocument = async (tradeInfo) => {
    const statusList = [{
        ...tradeInfo,
        "price": tradeInfo.candleOpen,
    }]
    const newTradeInfo = {
        tradeId: uniqid(),
        ...tradeInfo,

        price: tradeInfo.candleOpen,
        statusList,
        createdDate: new Date()
    }
    console.log("newTradeInfo ===>", newTradeInfo)

    return new Promise((resolve, reject) => {
        const trade = new Trade(newTradeInfo)
        return trade.save((err, trade) => {
            if (err) {
                reject(err)
            }
            resolve(true)
            // console.log(colors.green.bold(trade))
        })
    })

}

Trades.findDocument = async () => await Trade.find({ status: "open" }).exec();


Trades.updateDocument = async (tradeInfo, mfi, sar, candleOpen) => {
    const { tradeId, position, symbol, portfolio } = tradeInfo
    const status = "close"
    const pnl = utils.getPNL(tradeInfo, candleOpen)
    const newPortfolioAmount = portfolio + pnl.amount
    console.log("newPortfolioAmount", portfolio, pnl, newPortfolioAmount)
    const statusInfo = {
        symbol,
        mfi,
        sar,
        candleOpen,
        status,
        position,
        price: candleOpen,
        updatedDate: new Date()
    }
    console.log(tradeId)
    const res = await Trade.findOneAndUpdate({ tradeId: tradeId }, { $set: { status, pnl, portfolio: newPortfolioAmount }, $push: { statusList: statusInfo } }, { new: true });
    await Portfolios.updateDocument("MFI_SAR_HEIKINASHI", newPortfolioAmount)
    if (res.status == "close")
        // console.log("updateResp ===>", res)
        console.log(colors.green.bold(`trade ${tradeId} ${position} positoin closed successfully`))

}
module.exports = Trades


// data={
//     "_id" : ObjectId("60a11b7ed9e46c619c2dea66"),
//     "tradeId" : "g7kmw5ja4kor7ec1q",
//     "symbol" : "BTC/USDT",
//     "status" : "open",
//     "position" : "short",
//     "portfolio" : 2000,
//     "price" : 48666.85322641,
//     "statusList" : [
//         {
//             "_id" : ObjectId("60a11b7ed9e46c619c2dea67"),
//             "symbol" : "BTC/USDT",
//             "mfi" : 49.91036119,
//             "sar" : 48750.15341288,
//             "candleOpen" : 48666.85322641,
//             "status" : "open",
//             "position" : "short",
//             "portfolio" : 2000,
//             "price" : 48666.85322641,
//             "createdDate" : ISODate("2021-05-16T13:17:50.851Z")
//         },

//     ],
//     "createdDate" : ISODate("2021-05-16T13:17:50.845Z"),
//     "__v" : 0,

// }


// configDocs = [
//     { name: "cronPattern", value: "*/5 * * * * *" },
//     { name: "symbol", value: "BTC/USDT" },
//     {
//         name: "dbConfig",
//         value: {
//             "host": "localhost",
//             "port": "4000",
//             "dbName": "binance-trading",
//             "url": "mongodb://127.0.0.1:27017/binance-trading"
//         }
//     },
//     {
//         name: "binance", value: {
//             "APIKEY": "UGAqj7YByHO8JXKFZLJGUr5fJ5XB5f5VQ29SJlh1Pj6uU1lu05un1C6gQuONxAda",
//             "APISECRET": "77jg0b47C2kfuSsPELcrml2aTRuU0JmjHOwG0JMIrrvgKhFYmo9zHZJTH5hHqJfi"
//         }
//     },
//     {
//         name: "taapi",
//         value: {
//             "SECRET": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNpZGRlc2g5NzZAZ21haWwuY29tIiwiaWF0IjoxNjE3MzY5MTA0LCJleHAiOjc5MjQ1NjkxMDR9.v-y2jij-f5eviHQw8vstTWpKDuggeBSbQIyPq_mE8PE"
//         }
//     },
//     {
//         name: "app",
//         value: { "port": "3000" }
//     }
// ]