"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../controllers/bnnmarketcall/index");
const router = express_1.Router();
router.get("/bnnmarketcall", index_1.getbnnmarketcallData);
exports.default = router;
