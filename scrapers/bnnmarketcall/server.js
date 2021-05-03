const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

const PORT = 3000;

const { bnnmarketcall } = require('./bnnmarketcallModel');

//change name, not get forum
async function getForum() {
	try {
		const { data } = await axios.get(
			'https://www.bnnbloomberg.ca/market-call/picks'
		);

		const $ = cheerio.load(data);

		parsedData = [];

		//#content-container > div.content-wrapper > section > div.content-main > section > table > tbody > tr > td.guestCol > div > span
		$("#content-container > div.content-wrapper > section > div.content-main > section > table > tbody > .pickRow").each((index, element) => {

			let month = $(element).find("td.Date > div.month").text();
			let day = $(element).find("td.Date > div.day").text();
			let guest = $(element).find("div > span").text();
			let focus = $(element).find("td.focusCol > div").text();
			let picks = [];
			$(element).find('td.pickCol > div.Picks > div.Pick').each((i, elm) => {
				let pick = {};
				let pickName = $(elm).find("a").text();
				let parsedTicker = $(elm).find("a").attr('href');
				let ticker = parsedTicker.substr(7);
				pick.name = pickName;
				pick.ticker = ticker; 
				picks.push(pick);
			});

			parsedData.push({'month': month, 'day': day, 'guest': guest, 'focus': focus, 'picks': picks});
		});

		return parsedData;
	} catch (error) {
		console.log(error);
		//should log this
	}
}

async function bnnmarketcallscript(dbURI){
	console.log("Making request");
	let response = await getForum();
	
	// Connect to Mongo
	mongoose
	.connect(dbURI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('MongoDB Connected...');
	})
	.catch((err) => console.log(err));
	
	console.log(response);

	for(let i = 0; i < response.length; i++){

		let foundCurrentEntry = await bnnmarketcall.findOne({day: response[i].day, month: response[i].month});
		if(foundCurrentEntry === null){
			try {
				bnnmarketcall.create(response[i], function (err, entry) {
					//console.log("Entry: ", entry, " error is: ", err);
				});
			} catch (err) {
				//console.log(err);
			}
		}
	}
	
	process.exit(1);
}


module.exports = {
    bnnmarketcallscript
};
