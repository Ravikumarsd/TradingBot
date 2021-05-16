const express = require("express");
const config = require("config")


const db = require("./config/database");
const MFI_SAR_HEIKINASHI = require("./strategies/mfisarheikinashi");

const port = config.get("app").port
const app = express();
const cron = require('node-cron');
const Portfolios = require("./portfolio/portfolio.dao");

db()

const server = app.listen(port, async () => {
    console.log(`Listening to requests on https://localhost:${port}`);
    startSchedule()

});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server closed due to application termination')
        process.exit(0)
    })
});




const startSchedule = async () => {
    cron.schedule('*/5 * * * * *', async () => {
        console.log("running node cron ....")
        MFI_SAR_HEIKINASHI.getMultipleIndicators("BTC/USDT")
    });
}

