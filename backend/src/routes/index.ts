import { Router } from "express"
import { getbnnmarketcallData } from "../controllers/bnnmarketcall/index"

const router: Router = Router()

router.get("/bnnmarketcall", getbnnmarketcallData)

export default router