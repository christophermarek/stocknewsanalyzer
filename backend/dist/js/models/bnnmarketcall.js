"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bnnmarketcallSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    day: {
        type: String,
        required: true,
    },
    guest: {
        type: String,
        required: true,
    },
    picks: {
        type: [{ _id: String, name: String, ticker: String }],
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    text: {
        type: String,
        required: false,
    },
}, 
//dont know if i need these timestamps
{ timestamps: true });
exports.default = mongoose_1.model("bnnmarketcall", bnnmarketcallSchema);
