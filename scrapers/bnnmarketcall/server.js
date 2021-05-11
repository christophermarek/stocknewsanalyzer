const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

const PORT = 3000;

const { bnnmarketcall } = require('./bnnmarketcallModel');

async function getListPicksText(response){

	//console.log(response);

	for(let i = 0; i < response.length; i++){
		try{
			const { data } = await axios.get(
				response[i].url	
			);
	
			const $ = cheerio.load(data);
	
			$("#content-container > div.content-wrapper > section > div.content-main > article.standard-article.standard-video-article > div > div.article-text").each((index, element) => {
				let html = $.html(element);
				//console.log(html);
				response[i].text = html;
			});
		}catch (error){
			console.log(error);
			console.log("error getting pick text");
		}

	}

	return response;
	
}

//change name, not get forum
async function getListItem() {
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

			try{
				$(element).find('td.pickCol > div.Picks > div.Pick').each((i, elm) => {
					//console.log(elm);
					let pick = {};
					let pickName = $(elm).find("a").text();
					let parsedTicker = $(elm).find("a").attr('href');
					let ticker = parsedTicker.substr(7);
					pick.name = pickName;
					pick.ticker = ticker; 
					picks.push(pick);

				});

				parsedData.push({month: month, day: day, guest: guest, focus: focus, picks: picks});

			}catch (noPicksError){
				console.log("no picks yet, so not pushing this entry");
			}
			

		});

		pickTextsUrls= [];
		
		try{
			$("#content-container > div.content-wrapper > section > div.content-main > section > table > tbody > tr:nth-child(n) > td:nth-child(n) > div > ul > li > a").each((index, element) => {
				let link = "https://www.bnnbloomberg.ca" + element.attribs.href;

				//now we are going to have to parse this link to get the text
				//but its just stored in a class called article text so selecting it cant be hard.
				//get first and last name from link to join with rest of data
				let splitLink = link.split("/");
				let guestSplit = splitLink[3].split("-");
				let firstName = guestSplit[0];
				let lastName = guestSplit[1];

				//console.log(firstName + " " + lastName);
				pickTextsUrls.push({fName: firstName, lName: lastName, url: link})
				//save link and text
				
			});
		} catch (noLinkError){
			console.log("no link yet, so not pushing pick text url");
		}
		
		
		for(let i = 0; i < pickTextsUrls.length; i++){
			//now find the matching entry in our parsedData array by first and last name
			for(let n = 0; n < parsedData.length; n++){
				//console.log(parsedData[n].guest);
				if(parsedData[n].guest.toLowerCase().includes(pickTextsUrls[i].fName) && parsedData[n].guest.toLowerCase().includes(pickTextsUrls[i].lName)){
					parsedData[n].url = pickTextsUrls[i].url;
				}
			}
			//console.log(text);
		}
		
		//console.log(parsedData);
		return parsedData;
	} catch (error) {
		console.log(error);
		//should log this
	}
}

async function bnnmarketcallscript(dbURI){
	console.log("Making request");
	let response = await getListItem();
	
	let textResponse = await getListPicksText(response);


	//console.log(response);
	

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
	
	for(let i = 0; i < textResponse.length; i++){

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