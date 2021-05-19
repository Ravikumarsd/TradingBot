const mongoose = require("mongoose")
const configurationSchema = mongoose.Schema({
    symbol: String,
    leverage: Number,
    pattern:String,
    interval:String,
    binance: {
        APIKEY: String,
        APISECRET: String,
    },
    botStatus: String,
    taapi: {
        SECRET: String,
    }
})
const Configuration = mongoose.model("configuration", configurationSchema)
module.exports = Configuration




