const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const realtimeSchema = new Schema({
    frequencyList: {},
    sentimentList: {},
    },
    { timestamps: true }
);

const realtimeWsb = mongoose.model('wsbrealtime', realtimeSchema);
const realtimeCrypto = mongoose.model('cryptorealtime', realtimeSchema);

module.exports = {
    realtimeWsb,
    realtimeCrypto
};