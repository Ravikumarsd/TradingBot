const config = require("config")
var axios = require('axios');
const colors = require('colors');
const Trades = require("../trades/trades.dao");
const Portfolios = require("../portfolio/portfolio.dao");
const { SECRET, HOST_BULK } = config.get("taapi")
const MFI_SAR_HEIKINASHI = {}

MFI_SAR_HEIKINASHI.getMultipleIndicators = (symbol) => {
    axios.post(HOST_BULK, {
        "secret": SECRET,
        "construct": {
            "exchange": "binance",
            "symbol": symbol,
            "interval": "1m",
            "indicators": [{ "indicator": "mfi", chart: "heikinashi" }, { "indicator": "sar", chart: "heikinashi" }, { "indicator": "candle", chart: "heikinashi" }]
        }
    }).then(response => {
        const indicators = response.data.data
        const mfi = +indicators.find((indicator) => indicator.id.includes("mfi")).result.value.toFixed(8)
        const sar = +indicators.find((indicator) => indicator.id.includes("sar")).result.value.toFixed(8)
        const candleOpen = +indicators.find((indicator) => indicator.id.includes("candle")).result.open.toFixed(8)

        // const mfi= 22.66605291
        // const sar= 47714.76823078
        // const candleOpen= 48572.98988915

        console.log(colors.green.bold("symbol:", symbol))
        console.log(colors.yellow("mfi:", mfi))
        console.log(colors.yellow("sar:", sar))
        console.log(colors.yellow("candleOpen:", candleOpen))

        MFI_SAR_HEIKINASHI.isPositionOpen().then((openedPosition) => {
            const { tradeId, status, position } = openedPosition
            if (openedPosition) {
                console.log(colors.green.bold(`opened position ===>, tradeId: ${tradeId}, position: ${position}, status: ${status}`))
                MFI_SAR_HEIKINASHI.closePosition(openedPosition, mfi, sar, candleOpen)
            } else {
                if (mfi && sar && candleOpen) {
                    //check for exit strategy
                    MFI_SAR_HEIKINASHI.openPosition(symbol, mfi, sar, candleOpen)
                } else {
                    console.error(colors.red.bold("error in finding the indicator value"));
                }
            }
        })

    }).catch(error => {
        console.error("error:", error)
    });
}

MFI_SAR_HEIKINASHI.isPositionOpen = async () => {
    try {
        const openedPositons = await Trades.findDocument();
        // console.log("openedPositons   ===>", openedPositons)
        const noOfOpenTrades = openedPositons && openedPositons.length;
        const status = noOfOpenTrades == 1 && openedPositons && openedPositons[0] && openedPositons[0].status;
        if (status == "open") {
            return openedPositons[0];
        } else if (!noOfOpenTrades) {
            return false;
        } else {
            //stop the cron job
        }
    } catch (err) {
        console.error("isPositionOpen  err  ===>", err);
    }
    // return false
}

MFI_SAR_HEIKINASHI.getTradePosition = (mfi, sar, candleOpen) => {
    const DEFAULT_MFI = 50;
    if (mfi > DEFAULT_MFI && sar < candleOpen) {
        //Long if mfi > 50 && sar <candleOpen
        return "long"
    }
    if (mfi < DEFAULT_MFI && sar > candleOpen) {
        return "short"
        //Short if mfi < 50 && sar > candleOpen
    }
}

MFI_SAR_HEIKINASHI.closePosition = (openedPosition, mfi, sar, candleOpen) => {
    const tradePostion = openedPosition.position
    if (tradePostion == "long" && candleOpen < sar) {
        Trades.updateDocument(openedPosition, mfi, sar, candleOpen)
    } else if (tradePostion == "short" && candleOpen > sar) {
        Trades.updateDocument(openedPosition, mfi, sar, candleOpen)
    } else {
        console.log(colors.blue.bold(`Waiting to close ${tradePostion} position....`))
    }
}

MFI_SAR_HEIKINASHI.openLongPosition = (symbol) => {
    console.log(colors.green.bold("opening Long position"))
    //open long position in binance

}

MFI_SAR_HEIKINASHI.openShortPositoin = (symbol) => {
    console.log(colors.red.bold("opening SHORT position"))
    //open short position in binance

}

MFI_SAR_HEIKINASHI.openPosition = (symbol, mfi, sar, candleOpen) => {
    MFI_SAR_HEIKINASHI.isPositionOpen().then(async (resp) => {
        if (resp) {
            console.log(colors.magenta.bold("position not taken: 1 trade is already in open state"))
            return false
        }
        console.log("inside open trade", symbol, mfi, sar, candleOpen)
        const tradePostion = MFI_SAR_HEIKINASHI.getTradePosition(mfi, sar, candleOpen)
        console.log(colors.magenta.bold("tradePostion in openPosition ===>", tradePostion))
        if (tradePostion) {
            const tradeInfo = {
                symbol, mfi, sar, candleOpen,
                status: "open",
                position: tradePostion
            }
            const portfolio = await Portfolios.findDocument("MFI_SAR_HEIKINASHI")
            tradeInfo.portfolio = portfolio.amount
            Trades.createDocument(tradeInfo).then((resp) => {
                if (resp) {
                    if (tradePostion == "long") {
                        MFI_SAR_HEIKINASHI.openLongPosition()
                    } else if (tradePostion == "short") {
                        MFI_SAR_HEIKINASHI.openShortPositoin()
                    }
                }
            }).catch((err) => {
                console.log(colors.red.bold(err))
            })
        } else {
            console.error(colors.red.bold("No trade singal at this moment"))
        }
    })


}





module.exports = MFI_SAR_HEIKINASHI