const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();
console.log("dotenv", dotenv);

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

async function main(){
	console.log("Making request");
	let response = await getForum();

	//console.log(response);

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

		//maybe run a validation test on response[i], to see
		//before we post the data to our database. It would be bad
		//not too, could just compare it to an interface and make sure it
		//has all the right properties and that they are not blank or null or undefined
		//important for future automation.
		//console.log(response[i]);
		try {
			bnnmarketcall.create(response[i], function (err, entry) {
				//console.log("Entry: ", entry, " error is: ", err);
			});
		} catch (err) {
			//console.log(err);
		}
	}

	//lots of things to do.
	//first I need to make sure there is no duplicate insertions.
	//can probably do this by just checking the 5 days of the week, or even better
	//would be starting day of the week - current day. Check those for duplicates

	//ignore the days that aren't posted yet.

	//add to the stock picks the ticker
	//so convert it to an array of objects that are {name: 'String' ticker: 'String'}
	//you can get ticker from stripping it off the href link.

	//I also want to get the link of the top picks for the author description.
	//on the authors top picks article theres a div with class article-text, that looks like it has everything
	//can just store that in the db as a large string, the html I mean. Aslong as we arent storing the site banner
	//or ads it'll be ok.

	//catch error for no internet, maybe write to log file.
	//like log every step so if it crashes i can find the problem quick
	//then make a quick reference txt file of the format of the object going into the db so we can parse db quick.
	//console.log("end of script");
}


console.log("Script beginning");
main();