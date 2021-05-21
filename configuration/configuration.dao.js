const Configuration = require("./configuration.model")

const Configurations = {}

// Configurations.createDocument = (amount) => {
//     const portfolio = new Portfolio({ amount })
//     portfolio.save((err, portfolio) => {
//         if (err) {
//             console.error(err)
//         }
//         console.log("portfolio ===>>", portfolio)
//     })
// }

Configurations.findDocument = async () => await Configuration.findOne({}).exec();

// Configurations.updateDocument = async (symbol) => {
//     // console.log("Portfolios.updateDocument ===>", account,amount)
//     const newPortfolio = await Configuration.findOneAndUpdate({ accountName: account }, { $set: { amount } }, { new: true });
//     console.log("newPortfolio ===>", newPortfolio)
// }

module.exports = Configurations
