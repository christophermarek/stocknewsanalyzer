const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cryptocurrencySchema = new Schema({
    freqList: {} ,
    date: { type: Date } ,
    numComments: Number,
    threadId: { type: String }
});

const cryptocurrency = mongoose.model('cryptocurrency', cryptocurrencySchema);

module.exports = {
    cryptocurrency
};