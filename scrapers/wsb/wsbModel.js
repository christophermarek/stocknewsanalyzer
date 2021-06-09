const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wsbSchema = new Schema({
    freqList: {},
    date: { type: Date },
    numComments: Number,
    threadId: { type: String },
    },
    { timestamps: true }
);

const wsb = mongoose.model('wsb', wsbSchema);

module.exports = {
    wsb
};