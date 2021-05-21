const mongoose = require("mongoose")
const candleSchema = mongoose.Schema({
    symbol:String,
    interval:String,
    time: { type: Number, index: true, unique: true },
    closeTime: Number,
    open: String,
    high: String,
    low: String,
    close: String,
    volume: String,
    quoteVolume: String,
    takerBuyBaseVolume: String,
    takerBuyQuoteVolume: String,
    trades: Number,
    isFinal: Boolean
})
const Candle = mongoose.model("candle", candleSchema)
module.exports = Candle

