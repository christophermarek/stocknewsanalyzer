const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();
console.log("dotenv", dotenv);

const PORT = 3000;

const { bnnmarketcall } = require('./bnnmarketcallModel');

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
			//let picksContainer = $(element).find("td.pickCol > div");
			let picks = [];
			$(element).find('td.pickCol > div.Picks > div.Pick').each((i, elm) => {
				let pick = $(elm).find("a").text();
				picks.push(pick);
			});

			parsedData.push({'month': month, 'day': day, 'guest': guest, 'focus': focus, 'picks': picks});
		});

		return parsedData;
	} catch (error) {
		throw error;
	}
}

async function main(){
	console.log("Making request");
	let response = await getForum();

	//console.log(response);

	//add a year property or convert it to a mongodb datetime

	//now the file is structured properly we can use our db.

	//step 1 is to filter out the picks that are blank, means their episode isnt up yet with a link of picks
	//[ '', '', '' ] this is what it looks like

	//step 2 is to post to mongodb
	

	// Connect to Mongo
	mongoose
	.connect(process.env.MONGO_URI_DEV, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('MongoDB Connected...');
	})
	.catch((err) => console.log(err));
	
	for(let i = 0; i < response.length; i++){
		
		try {
			bnnmarketcall.create(response[i], function (err, entry) {
				//console.log("Entry: ", entry, " error is: ", err);
			});
		} catch (err) {
			//console.log(err);
		}
	}

	console.log("end of script");
}


console.log("Script beginning");
main();