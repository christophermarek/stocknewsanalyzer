const fs = require('fs');
const readline = require('readline');
const { bnnmarketcallscript } = require('./bnnmarketcall/server.js');

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
        default:
            console.log("no script found for passed script " + scriptName);
    }
}

function main(){
    //step 1
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
            
            if(active == 1){
                executeScript(scriptName);
            }
        }
    } catch(e) {
        console.log('Error:', e.stack);
    }
    
    //update script to also fetch the full html of the article. It will only be text so itll be light on sizes
    
}

main();


