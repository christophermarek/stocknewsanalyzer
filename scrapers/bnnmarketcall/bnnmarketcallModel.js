const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bnnmarketcallSchema = new Schema({
    month: { type: String } ,
    day: { type: String } ,
    guest: { type: String } ,
    focus: { type: String } ,
    picks: [String],
});

const bnnmarketcall = mongoose.model('bnnmarketcall', bnnmarketcallSchema);
module.exports = {
    bnnmarketcall
};