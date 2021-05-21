const moment = require("moment")
const binance = require("./binance/binance")
const Configurations = require("./configuration/configuration.dao")
const Portfolios = require("./portfolio/portfolio.dao")

const utils = {}
utils.getPNL = (tradeInfo, closePrice) => {
    // console.log("inside getPNL",tradeInfo,closePrice)
    const portfolio = tradeInfo.portfolio
    const statusList = tradeInfo.statusList
    // console.log("statusList ===>",statusList)
    const openPositoinInfo = statusList.find(info => info.status == "open")
    // console.log("openPositoinInfo ===>",openPositoinInfo)
    const position = openPositoinInfo.position
    const openPrice = openPositoinInfo.price
    let pnl = {};
    if (position == "long") {
        const percentChangeInTrade = (closePrice - openPrice) / openPrice * 100
        pnl.amount = (portfolio / 100) * percentChangeInTrade
        pnl.percent = percentChangeInTrade
        return pnl
    } else if (position == "short") {
        // console.log("inside PNL short")
        const percentChangeInTrade = (openPrice - closePrice) / openPrice * 100
        // console.log("percentChangeInTrade in short",percentChangeInTrade)
        pnl.amount = (portfolio / 100) * percentChangeInTrade
        pnl.percent = percentChangeInTrade
        // console.log("pnl ===>",pnl)
        return pnl
    }

}

utils.getQTY = async (candleOpen, account, symbol) => {
    // console.log("account in getQTY ==>> ", account, candleOpen)
    //invest 70% of portfolio
    const investAmount = (account / 100) * 80
    let qty = investAmount / candleOpen

    console.log("investAmount qty ====>>", investAmount, qty)
    const quantityPrecision = await utils.getFuturesQuantityPrecision(symbol)
    qty = qty.toFixed(quantityPrecision)
    return qty
}

utils.formatSymbolToBinance = (symbol) => {
    symbol = symbol.split("/").join("")
    return symbol

}

utils.getFuturesQuantityPrecision = async (symbol) => {
    symbol = utils.formatSymbolToBinance(symbol)
    const futuresExchangeInfo = await binance.futuresExchangeInfo()
    const quantityPrecision = futuresExchangeInfo.symbols.find((info) => info.pair == symbol).quantityPrecision
    // console.log("getFuturesQuantityPrecision", quantityPrecision)

    return quantityPrecision
}

utils.getSpotQuantityPrecision = async (symbol) => {
    symbol = utils.formatSymbolToBinance(symbol)
    const spotExhangeInfo = await binance.exchangeInfo()
    const quantityPrecision = spotExhangeInfo.symbols.find((info) => info.symbol == symbol)
    console.log("quantityPrecision", quantityPrecision)
}

utils.validCandelIntervals = (candles, symbol) => {
    const diffArray = []
    symbol = utils.formatSymbolToBinance(symbol)
    for (let i = 1; i < candles.length; i++) {
        // console.log(candles[i - 1].time)
        const diff = moment(candles[i].time).minute() - moment(candles[i - 1].time).minute()
        // console.log(diff)
        //revesed array
        if ((diff == -1 || diff == 59) && candles[i].symbol == symbol) {
            diffArray.push(true)
        } else {
            diffArray.push(false)
        }
    }
    if (diffArray.some((diff) => diff == false)) {
        return false
    } else {
        return true
    }
}
module.exports = utils
