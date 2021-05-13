"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../controllers/bnnmarketcall/index");
const index_2 = require("../controllers/yahooStockPrices/index");
const router = express_1.Router();
//need to change to a query string 
router.get("/yahoofinance", index_2.getCurrentPriceController);
router.get("/bnnmarketcall", index_1.getbnnmarketcallData);
exports.default = router;
