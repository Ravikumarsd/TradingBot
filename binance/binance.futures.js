
const binance = require("./binance")
const utils = require('../utils');
const Configurations = require("../configuration/configuration.dao");
const Candels = require("../candle/candle.dao");
const colors = require("colors")
const BinanceFutures = {}

BinanceFutures.getBinanceFuturesAccount = async () => {
    console.log("inside futures account")
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
// time: 1621529700000,
//     closeTime: 1621529759999,
//     open: '38978.53',
//     high: '39329.84',
//     low: '38953.32',
//     close: '39319.14',
//     volume: '953.241',
//     quoteVolume: '37336657.96042',
//     takerBuyBaseVolume: '617.687',
//     takerBuyQuoteVolume: '24202009.12083',
//     trades: 12759

BinanceFutures.getMFI = async (symbol) => {
    let candles = await Candels.findDocument()
    // console.log("candles ==>",candles)
    symbol = symbol.split("/").join("")
    const isValidCandleInterval = utils.validCandelIntervals(candles, symbol)
    if (candles && candles.length == 15 && isValidCandleInterval) {
        candles = candles.reverse()

        candles = candles.map((candle, i) => {
            const { high, low, close, volume } = candle;
            candle.typicalPrice = (Number(high) + Number(low) + Number(close)) / 3;
            candle.rawMF = candle.typicalPrice.toFixed(4) * volume;
            candle.rawMF = candle.rawMF.toFixed(4);
            if (i > 0) {
                if (candles[i].typicalPrice > candles[i - 1].typicalPrice) {
                    candle.value = 1;
                } else {
                    candle.value = 0;
                }
            }

            return candle;
        });


        candles = candles.slice(1);

        let positiveSum = candles
            .filter((candle) => candle.value == 1)
            .reduce((acc, cur) => acc + Number(cur.rawMF), 0);
        // console.log(positiveSum);
        let negativeSum = candles
            .filter((candle) => candle.value == 0)
            .reduce((acc, cur) => acc + Number(cur.rawMF), 0);
        // console.log(negativeSum);
        const MFR = positiveSum / negativeSum;
        const MFI = 100 - 100 / (1 + MFR);
        const result = {
            time: candles[candles.length - 1].time,
            MFI: Number(MFI.toFixed(4))
        }
        return result
    } else {
        return false
        // colors.yellow.bold("candles are less than 14 :", candles.length)
    }


    // console.log(MFI);

    // let start = i + 13;
    // let positiveSum = 0;
    // let negativeSum = 0;

    // for (let j = start - 13; j <= start; j++) {
    //     if (candles[j].value == 1) {
    //         positiveSum += candles.rawMF
    //         //positive sum
    //     } else if (candles[j].value == 0) {
    //         //negative sum
    //         negativeSum += candles.rawMF
    //     }
    // }
    // const MFR = positiveSum / negativeSum
    // const MFI = 100 - (100 / (1 + MFR))
    // candle.mfi = MFI
}


module.exports = BinanceFutures
