const fs = require('fs');
const readline = require('readline');
const { bnnmarketcallscript } = require('./bnnmarketcall/server.js');
const { dailyScrape } = require('./wsb/wsb.js');
/*
    Scraper executor file

    This will be called once every 24 hours from the server to execute the
    scrapers.

*/

function executeScript(scriptName){
    switch(scriptName){
        case 'bnnmarketcall':
            bnnmarketcallscript(dbURI);
            break;
        case 'wsb':
            dailyScrape(generateTickerList());
            break;
        default:
            console.log("no script found for passed script " + scriptName);
    }
}

function generateTickerList(){

    //load all the tickers to check
    let usTickers = {filepath: './tickers/usTickers.txt', encoding: 'utf8'};
    //heroku cant find this text file for some reason. and make tickerList a global
    let tickerListTemp = [];

    try {
        let data = fs.readFileSync(usTickers.filepath, usTickers.encoding);
        let splitLines = data.split("\n");

        for (let i = 0; i < splitLines.length; i++){
            let line = splitLines[i];
            let splitLine = line.split("\t");
            //we really only care about the ticker, i dont know what the other column even means
            let ticker = splitLine[0];
            
            tickerListTemp.push(ticker);
        }

        return tickerListTemp;
    } catch(e) {
        console.log('Error:', e.stack);
    }

}

function main(){
    
    //parse scraperConf to get the active scrapers we will run
    dbURI = process.env.MONGO_URI_DEV;
    scraperConfig = {filepath: './scraperConf.txt', encoding: 'utf8'};

    var fs = require('fs');

    try {
        var data = fs.readFileSync(scraperConfig.filepath, scraperConfig.encoding);
        splitLines = data.split("\n");

        //run each scraper parsed where active is 1 in config
        //i = 1, skip first line
        for (i = 1; i < splitLines.length; i++){
            line = splitLines[i];
            splitLine = line.split(",")
            
            scriptName = splitLine[0];
            active = splitLine[1];
            
            console.log(`Executing ${scriptName}`);

            if(active == 1){
                executeScript(scriptName);
            }
        }
    } catch(e) {
        console.log('Error:', e.stack);
    }
}

main();


