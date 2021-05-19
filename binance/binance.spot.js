const binance = require("./binance")
const utils = require('../utils');



const BinanceSpot = {}

BinanceSpot.getBinanceSpotAccount = async () => {
    const balances = await binance.balance()
    const usdt = balances.USDT.available
    console.log("usdt available in spot account ===>>", usdt)
    return usdt

}

BinanceSpot.marketBuy = async (symbol, candleOpen) => {
    const account = await BinanceSpot.getBinanceSpotAccount()
    symbol = utils.formatSymbolToBinance(symbol)
    const qty = await utils.getQTY(candleOpen, account, symbol)
    console.log("BinanceSpot marketBuy qty ====>>>", qty)
    const buyResp = await binance.marketBuy(symbol, qty)
    return buyResp
    // console.log("buyResp ===>>", buyResp)
}

BinanceSpot.marketSell = async (tradeInfo) => {
    console.log("BinanceSpot market sell ===>>", tradeInfo)
    let { symbol, quantity } = tradeInfo
    symbol = utils.formatSymbolToBinance(symbol)
    const sellResp = binance.marketSell(symbol, quantity)
    console.log("BinanceSpot sellResp ===>>", sellResp)
    return sellResp
}
module.exports = BinanceSpot