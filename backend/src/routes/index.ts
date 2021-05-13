import { Router } from "express"
import { getbnnmarketcallData } from "../controllers/bnnmarketcall/index"
import { getCurrentPriceController } from "../controllers/yahooStockPrices/index"

const router: Router = Router()

//need to change to a query string 
router.get("/yahoofinance", getCurrentPriceController);

router.get("/bnnmarketcall", getbnnmarketcallData);

export default router;