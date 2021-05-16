const mongoose = require("mongoose")
const portfolioSchema = mongoose.Schema({ accountName: String, amount: Number })
const Portfolio = mongoose.model("portfolio", portfolioSchema)
module.exports = Portfolio

