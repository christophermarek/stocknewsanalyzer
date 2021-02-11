const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bnnmarketcallSchema = new Schema({
    month: { type: String } ,
    day: { type: String } ,
    guest: { type: String } ,
    focus: { type: String } ,
    picks: [ {name: String, ticker: String} ],
    date: { 
        type: Date, 
        default: Date.now,
    },
});

const bnnmarketcall = mongoose.model('bnnmarketcall', bnnmarketcallSchema);

module.exports = {
    bnnmarketcall
};