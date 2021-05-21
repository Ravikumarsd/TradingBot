const Candle = require("./candle.model")

const Candels = {}

Candels.createDocument = (info) => {
    const newInfo = {
        "symbol": info.s,
        "interval": info.i,
        "time": info.t,
        "closeTime": info.c,
        "open": info.o,
        "high": info.h,
        "low": info.l,
        "close": info.c,
        "volume": info.v,
        "quoteVolume": info.q,
        "takerBuyBaseVolume": info.V,
        "takerBuyQuoteVolume": info.Q,
        "trades": info.n,
        "isFinal": info.x
    }
    const candle = new Candle(newInfo)

    candle.save((err, candle) => {
        if (err) {
            // console.error(err)
        } else if (candle) {
            console.log("candle created successfully ===>>", candle.time)
        }

    })

}

Candels.findDocument = async (query = {}) => await Candle.find(query).sort({time:-1}).limit(15).exec()

// Candels.updateDocument = async (account, amount) => {
//     // console.log("Portfolios.updateDocument ===>", account,amount)
//     const newPortfolio = await Portfolio.findOneAndUpdate({ accountName: account }, { $set: { amount } }, { new: true });
//     console.log("newPortfolio ===>", newPortfolio)
// }

module.exports = Candels
