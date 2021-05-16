const Portfolio = require("./portfolio.model")

const Portfolios = {}

Portfolios.createDocument = (amount) => {
    const portfolio = new Portfolio({ amount })
    portfolio.save((err, portfolio) => {
        if (err) {
            console.error(err)
        }
        console.log("portfolio ===>>", portfolio)
    })

}

Portfolios.findDocument = async (account) => await Portfolio.findOne({ accountName: account }).exec();

Portfolios.updateDocument = async (account, amount) => {
    // console.log("Portfolios.updateDocument ===>", account,amount)

    const newPortfolio = await Portfolio.findOneAndUpdate({ accountName: account }, { $set: { amount } }, { new: true });
    console.log("newPortfolio ===>", newPortfolio)
}

module.exports = Portfolios
