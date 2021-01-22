const http = require('http');
const axios = require('axios')
const cheerio = require('cheerio');
const PORT = 3000;


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

	console.log(response);

}


console.log("Script beginning");
main();