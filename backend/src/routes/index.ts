import { Router } from "express"
import { getbnnmarketcallData } from "../controllers/bnnmarketcall/index"
import { getCurrentDataController, getCurrentPriceController, getHistoricalPricesController } from "../controllers/yahooStockPrices/index"
import { getAllWsbFrequencyLists, getWsbFrequencyListAtDate } from "../controllers/wsb/index"
import { getAllCryptoCurrencyFrequencyLists, getCryptoCurrencyFrequencyListAtDate } from "../controllers/cryptocurrency/index"

const router: Router = Router()

router.get("/yahoofinance/current-data/:id", getCurrentDataController);
router.get("/yahoofinance/current-price/:id", getCurrentPriceController);
router.get("/yahoofinance/historical-prices/:startMonth/:startDay/:startYear/:endMonth/:endDay/:endYear/:ticker/:frequency", getHistoricalPricesController);
router.get("/bnnmarketcall", getbnnmarketcallData);

router.get("/wsb/allFrequencyLists", getAllWsbFrequencyLists);
router.get("/wsb/singleFrequencyList/:date", getWsbFrequencyListAtDate);

router.get("/cryptocurrency/allFrequencyLists", getAllCryptoCurrencyFrequencyLists)
router.get("/cryptocurrency/singleFrequencyList/:date", getCryptoCurrencyFrequencyListAtDate);

export default router;