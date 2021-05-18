const mongoose = require("mongoose")
const tradeSchema = mongoose.Schema({
    "tradeId": String,
    "symbol": String,
    "position": String,
    "status": String,
    "price": Number,
    "pnl": { amount: Number, percent: Number },
    "portfolio": Number,
    "quantity": Number,
    "side": String,
    "createdDate": { type: Date, default: Date.now },
    "updatedDate": { type: Date },

    "statusList": [{
        "symbol": String,
        "position": String,
        "status": String,
        "price": Number,
        "pnl": { amount: Number, percent: Number },
        "portfolio": Number,
        "mfi": Number,
        "sar": Number,
        "candleOpen": Number,
        "quantity": Number,
        "side": String,
        "createdDate": { type: Date, default: Date.now },
    }],
    "binanceStatusList": [{}]

});

const Trade = mongoose.model('Trade', tradeSchema);
module.exports = Trade


