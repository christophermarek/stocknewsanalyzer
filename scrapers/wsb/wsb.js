'use strict';
const snoowrap = require('snoowrap');
const dotenv = require("dotenv");
const fs = require('fs');
const readline = require('readline');

dotenv.config();

function generateTickerList(){

    //load all the tickers to check
    let usTickers = {filepath: '../tickers/usTickers.txt', encoding: 'utf8'};
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

function wsbScraper(){

    

    let tickerList = generateTickerList();

    // Create a new snoowrap requester with OAuth credentials.

    const r = new snoowrap({
        userAgent: 'wsb scraper',
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        refreshToken: process.env.REDDIT_REFRESH_TOKEN
    });


    // Extracting every comment on a thread
    //r.getSubmission('4j8p6d').expandReplies({limit: 3, depth: 3}).then(console.log)

    //ok need to find what to actually set limit and depth too
    left-off: got ticker list now we just need to compare keyword in text to tickers in list
    //now i want to find the url for the new daily discussion thread
    //and try to just scrape that first

    //create dict for each ticker tickersMentioned[ticker] = count

    //for each comment, parse text

    //then compare keywords to a stockkeywords list

    //Then save the frequency of each keyword for that thread with the date of the thread & date of parse

    //parse hisstoric threads? maybe separate funciton

    //have features to autoscrape

}

wsbScraper();
