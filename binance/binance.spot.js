const binance = require("./binance")
const utils = require('../utils');



const BinanceSpot = {}

BinanceSpot.getBinanceSpotAccount = async (symbol) => {
    const currency = symbol.split("/")[0]
    // console.log("", "getBinanceSpotAccountcurrency", currency)
    const balances = await binance.balance()
    const value = balances[currency].available
    return value

    // (error, balances) => {
    //     if (error) return console.error(error);
    //     // console.info("balances()", balances);
    //     console.info("BNB balance: ", balances.BNB.available);
    // });



}

BinanceSpot.marketBuy = async (symbol, candleOpen) => {
    const account = await BinanceSpot.getBinanceSpotAccount("USDT/USDT")
    symbol = utils.formatSymbolToBinance(symbol)
    const qty = await utils.getQTY(candleOpen, account, symbol)
    console.log("BinanceSpot marketBuy qty ====>>>", qty)
    const buyResp = await binance.marketBuy(symbol, qty)
    return buyResp
    // console.log("buyResp ===>>", buyResp)
}

BinanceSpot.marketSell = async (tradeInfo) => {
    // console.log("BinanceSpot market sell ===>>", tradeInfo)
    try {
        let { symbol } = tradeInfo

        const quantity = await BinanceSpot.getBinanceSpotAccount(symbol)
        console.log("BinanceSpot market sell ===>>", symbol, quantity)
        symbol = utils.formatSymbolToBinance(symbol)
        const sellResp = await binance.marketSell(symbol, quantity)
        console.log("BinanceSpot sellResp ===>>", sellResp)
        return sellResp
    } catch (err) {
        console.log("BinanceSpot sellResp err ===>>", err.body)
        return false
    }

}
module.exports = BinanceSpot