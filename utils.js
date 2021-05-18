const binance = require("./binance/binance")
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

utils.getQTY = async (candleOpen, account,symbol) => {
    console.log("account in getQTY ==>> ", account, candleOpen)
    //invest 70% of portfolio
    const investAmount = (account / 100) * 80
    let qty = investAmount / candleOpen

    console.log("investAmount ====>>", investAmount, qty)
    const quantityPrecision = await utils.getQuantityPrecision(symbol)
    qty = qty.toPrecision(quantityPrecision)
    return qty
}
utils.formatSymbolToBinance = (symbol) => {
    symbol = symbol.split("/").join("")
    return symbol

}

utils.getQuantityPrecision = async (symbol) => {
    symbol = utils.formatSymbolToBinance(symbol)
    const futuresExchangeInfo = await binance.futuresExchangeInfo()
    const quantityPrecision = futuresExchangeInfo.symbols.find((info) => info.pair == symbol).quantityPrecision
    // console.log("getQuantityPrecision", quantityPrecision)

    return quantityPrecision
}
module.exports = utils


