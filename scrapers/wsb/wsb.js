'use strict';
const snoowrap = require('snoowrap');
const dotenv = require("dotenv");
const fs = require('fs');
const readline = require('readline');
const axios = require('axios');

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

async function getComments(commentIds){

    const r = new snoowrap({
        userAgent: 'wsb scraper',
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        refreshToken: process.env.REDDIT_REFRESH_TOKEN
    });

    //ok need to find what to actually set limit and depth too
    //I feel like too much depth might be useless since certain comments 
    let comments = await r.getSubmission('nhoua8').expandReplies({limit: 20000, depth: 1});
    return comments;
}

async function wsbScraper(){

    

    let tickerList = generateTickerList();

    // Create a new snoowrap requester with OAuth credentials.

    
    //this site gets us all the comment id's, we need this because the reddit api will 
    //block us because there are too many comments to request at once.
    const { data } = await axios.get(
        'https://api.pushshift.io/reddit/submission/comment_ids/nhoua8'
    );

    // Extracting every comment on a thread
    let comments = await getComments(data.data);

    //console.log(comments.comments);

    //now i want to find the url for the new daily discussion thread
    //and try to just scrape that first

    //create dict for each ticker tickersMentioned[ticker] = count

    //for each comment, parse text
    /*
    for(let i = 0; i < comments.comments.length; i++){
        console.log(comments.comments[i].body);
        console.log(i);
    }
    */
    

    //then compare keywords to a stockkeywords list

    //Then save the frequency of each keyword for that thread with the date of the thread & date of parse

    //parse hisstoric threads? maybe separate funciton

    //have features to autoscrape

}

wsbScraper();
