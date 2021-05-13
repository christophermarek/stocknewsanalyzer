"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoricalPricesController = exports.getCurrentPriceController = exports.getCurrentDataController = void 0;
const yahoo_stock_prices_fetch_1 = require("./yahoo-stock-prices-fetch");
const getCurrentDataController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentData = yield yahoo_stock_prices_fetch_1.getCurrentData(req.params.id);
        res.status(200).json({ currentData });
    }
    catch (error) {
        res.status(400).json({ error: "Invalid ticker" });
    }
});
exports.getCurrentDataController = getCurrentDataController;
const getCurrentPriceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentPrice = yield yahoo_stock_prices_fetch_1.getCurrentPrice(req.params.id, false);
        res.status(200).json({ currentPrice });
    }
    catch (error) {
        res.status(400).json({ error: "Invalid ticker" });
    }
});
exports.getCurrentPriceController = getCurrentPriceController;
const getHistoricalPricesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /*
        startMonth: any,
        startDay: any,
        startYear: any,
        endMonth: any,
        endDay: any,
        endYear: any,
        ticker: any,
        frequency: any,
        callback: any,
    */
        const historicalPrices = yield yahoo_stock_prices_fetch_1.getHistoricalPrices(req.params.startMonth, req.params.startDay, req.params.startYear, req.params.endMonth, req.params.endDay, req.params.endYear, req.params.ticker, req.params.frequency, false);
        res.status(200).json({ historicalPrices: historicalPrices });
    }
    catch (error) {
        res.status(400).json({ error: "Invalid request" });
    }
});
exports.getHistoricalPricesController = getHistoricalPricesController;
