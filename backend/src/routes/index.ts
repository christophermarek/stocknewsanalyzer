import { Router } from "express"
import { getbnnmarketcallData } from "../controllers/bnnmarketcall/index"
import { getCurrentDataController, getCurrentPriceController, getHistoricalPricesController } from "../controllers/yahooStockPrices/index"

const router: Router = Router()

router.get("/yahoofinance/current-data/:id", getCurrentDataController);
router.get("/yahoofinance/current-price/:id", getCurrentPriceController);
router.get("/yahoofinance/historical-prices/:startMonth/:startDay/:startYear/:endMonth/:endDay/:endYear/:ticker/:frequency", getHistoricalPricesController);
router.get("/bnnmarketcall", getbnnmarketcallData);

export default router;