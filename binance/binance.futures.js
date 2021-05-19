
const binance = require("./binance")
const utils = require('../utils');
const Configurations = require("../configuration/configuration.dao");

const BinanceFutures = {}
BinanceFutures.getBinanceFuturesAccount = async () => {
    const account = await binance.futuresBalance()
    const usdt = account.find((acc) => acc.asset == "USDT").balance
    console.log("usdt in account ===>", usdt)
    return usdt
    // console.log("usdt in account", usdt)
}

BinanceFutures.marketBuy = async (symbol, candleOpen) => {
    const account = await BinanceFutures.getBinanceFuturesAccount()
    symbol = utils.formatSymbolToBinance(symbol)
    const qty = await utils.getQTY(candleOpen, account, symbol)
    console.log("marketBuy qty ====>>>", qty)
    const adjustMarginTypeResp = await BinanceFutures.adjustMarginType(symbol)
    const conf = await Configurations.findDocument()
    const leverage = conf.leverage
    const adjustLeverageResp = await BinanceFutures.adjustLeverage(symbol, leverage)
    const buyResp = await binance.futuresMarketBuy(symbol, qty)
    return buyResp
    // console.log("buyResp ===>>", buyResp)
}

BinanceFutures.marketSell = async (symbol, candleOpen) => {
    const account = await BinanceFutures.getBinanceFuturesAccount()
    symbol = utils.formatSymbolToBinance(symbol)
    const qty = await utils.getQTY(candleOpen, account, symbol)
    console.log("marketSell qty ====>>>", qty)
    const adjustMarginTypeResp = await BinanceFutures.adjustMarginType(symbol)
    const adjustLeverageResp = await BinanceFutures.adjustLeverage(symbol, 5)
    const sellResp = await binance.futuresMarketSell(symbol, qty)
    return sellResp
    // console.log("sellResp ===>>", sellResp)
}

BinanceFutures.adjustLeverage = async (symbol, leverage) => {
    symbol = utils.formatSymbolToBinance(symbol)
    const leverageResp = await binance.futuresLeverage(symbol, leverage)
    console.log("leverageResp ===>>", leverageResp)
}

BinanceFutures.adjustMarginType = async (symbol) => {
    symbol = utils.formatSymbolToBinance(symbol)
    const adjustMarginTypeResp = await binance.futuresMarginType(symbol, 'CROSSED')
    console.log("adjustMarginTypeResp===>>", adjustMarginTypeResp)
}

BinanceFutures.closePositon = async (tradeInfo) => {
    const { quantity, side } = tradeInfo
    const symbol = utils.formatSymbolToBinance(tradeInfo.symbol)

    const params = {
        side, reduceOnly: true
    }
    const closePositon = side == "BUY"
        ? await binance.futuresMarketSell(symbol, quantity, params)
        : await binance.futuresMarketBuy(symbol, quantity, params)
    console.log("closePositon ===>", closePositon)

    return closePositon

    // Binance.futures_create_order(symbol=self.symbol, side='BUY', type='MARKET', quantity=1, reduceOnly='true')
    // if (position == "long") {
    //     //execute market buy
    //     const params = {
    //         side, reduceOnly: true
    //     }
    //     const longCloseResp = await binance.futuresMarketSell(symbol, quantity, params)
    //     console.log("long position closed response ===>", longCloseResp)
    // } else if (position == "short") {
    //     const params = {
    //         side, reduceOnly: true
    //     }
    //     const shortCloseResp = await binance.futuresMarketBuy(symbol, quantity, params)
    //     console.log("short position closed response ===>", shortCloseResp)
    // }

    // const futuresOrder = async ( side, symbol, quantity, price = false, params = {} ) => {

    //get quantity from databse
    // const quantity = ""
    // const params = {
    //     symbol,
    //     side,
    //     timestamp: Date.now(),
    //     type: "MARKET",
    //     quantity,
    //     reduceOnly: true
    // }

    // // let signature = crypto.createHmac('sha256', Binance.options.APISECRET).update(query).digest('hex');

    // const headers = {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     'X-MBX-APIKEY': key
    // }
    // axios.post(`https://fapi.binance.com/fapi/v1/order`, {
    //     params,
    //     headers
    // }).then((resp) => {
    //     console.log("new trade resp ===>", resp)

    // }).catch((err) => {
    //     console.log("new trade err", err)
    // })


}

// binanceStatusList=[
//     sellResp ===>> [Object: null prototype] {
//         orderId: 5249348886,
//         symbol: 'DOTUSDT',
//         status: 'NEW',
//         clientOrderId: 'zIm8RrBKonMurN5qacLpVK',
//         price: '0',
//         avgPrice: '0.0000',
//         origQty: '0.3',
//         executedQty: '0',
//         cumQty: '0',
//         cumQuote: '0',
//         timeInForce: 'GTC',
//         type: 'MARKET',
//         reduceOnly: false,
//         closePosition: false,
//         side: 'SELL',
//         positionSide: 'BOTH',
//         stopPrice: '0',
//         workingType: 'CONTRACT_PRICE',
//         priceProtect: false,
//         origType: 'MARKET',
//         updateTime: 1621265593156
//       }
// ]
// sellResp ===>> [Object: null prototype] {
//     orderId: 5249348886,
//     symbol: 'DOTUSDT',
//     status: 'NEW',
//     clientOrderId: 'zIm8RrBKonMurN5qacLpVK',
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
//     side: 'SELL',
//     positionSide: 'BOTH',
//     stopPrice: '0',
//     workingType: 'CONTRACT_PRICE',
//     priceProtect: false,
//     origType: 'MARKET',
//     updateTime: 1621265593156
//   }
// Binance.futures_create_order(symbol=self.symbol, side='BUY', type='MARKET', quantity=1, reduceOnly='true')


module.exports = BinanceFutures
