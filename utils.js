const Portfolios = require("./portfolio/portfolio.dao")

const utils = {}
utils.getPNL =  (tradeInfo, closePrice) => {
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
module.exports = utils

