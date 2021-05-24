'use strict';
const snoowrap = require('snoowrap');
const dotenv = require("dotenv");
const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const cheerio = require('cheerio');

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
    
    for(let i = 0; i < commentIds.length; i++){
        let comment = await r.getComment(commentIds[i]).body;
    }

    //ok need to find what to actually set limit and depth too
    //I feel like too much depth might be useless since certain comments 
    
    //return comments;
}

async function getCommentIds(){
    const { data } = await axios.get(
        'https://api.pushshift.io/reddit/submission/comment_ids/nhoua8'
    );

    return data.data;
}

async function getCommentText(commentIdStrings){

    let commentTextList = [];
    for(let i = 0; i < commentIdStrings.length; i++){
        const { data } = await axios.get(
            `https://api.pushshift.io/reddit/comment/search?ids=${commentIdStrings[i]}`
        );
        //clean data
        for(let j = 0; j < data.data.length; j++){

            commentTextList.push({createdAtUTC: data.data[j].created_utc, text: data.data[j].body});
        }

    }

    return commentTextList;
}

async function getRedditThreads(){
    const { data } = await axios.get(
        'https://www.reddit.com/r/wallstreetbets/search?q=flair%3A%22Daily+Discussion%22&restrict_sr=on&sort=new&t=all'
    );

    const $ = cheerio.load(data);
    let parsedData = [];
    //console.log($);

    // > div:nth-child(16) > div > header > a

    $('a').each((i, link) => {
        const href = link.attribs.href;
        if(href[0] == "h" && href[href.length - 1] == '/' && !isNaN(href[href.length - 2])){
            console.log(href);
        }
    });

    //the next page starts at the last article
}

async function wsbScraper(dateToScrape){

    

    let tickerList = generateTickerList();

    // Create a new snoowrap requester with OAuth credentials.

    let commentIds = await getCommentIds();

    //the comment id string must be less than 2048 per request or the server wont be able to handle it
    //i got a 414 error and im just assuming 2048 because that is url length limit of most browsers
    let commentIdStrings = []; 
    let commentIdString = "";
    
    for(let i = 0; i < commentIds.length; i++){
        //max url length is 2048, most of the time
        if(commentIdString.length > 2040){
            //del last comma
            if(commentIdString.charAt(commentIdString.length - 1) == ","){
                commentIdString = commentIdString.slice(0, -1);
            }
            commentIdStrings.push(commentIdString);
            commentIdString = "";
        }

        //no commma last line
        if(i == commentIds.length - 1){
            commentIdString += commentIds[i];
        }else{
            commentIdString += commentIds[i] + ",";
        }
    }

    let commentTextList = await getCommentText(commentIdStrings);
    //this site gets us all the comment id's, we need this because the reddit api will 
    //block us because there are too many comments to request at once.

    // Extracting every comment on a thread

    //now i want to find the url for the new daily discussion thread
    //and try to just scrape that first

    //create dict for each ticker tickersMentioned[ticker] = count

    //then compare keywords to a stockkeywords list
    let frequencyList = {}    

    //Then save the frequency of each keyword for that thread with the date of the thread & date of parse
    for(let i = 0; i < commentTextList.length; i++){
        //regex is to split strings but not include whitespace
        let tokens = commentTextList[i].text.split(" ");
        for(let j = 0; j < tokens.length; j++){
            let token = tokens[j].toLowerCase();
            if(token.charAt(0) == $){
                token = token.slice(1);
            }
            if(tickerList.includes(token)){

                if(frequencyList[token] == undefined){
                    frequencyList[token] = 1;
                }else{
                    frequencyList[token] += 1;
                }
            }
        }
        
    }

    console.log(frequencyList);
    //can dump this whole thing to db since it is only 640 lines and 8kb. So i can run this script 125 times until i use a mb on average since each daily has about the same amount of comments.
    //mongodb i have 512 mb of storage so I can run this script for 64000 times. 

    //have features to autoscrape

}

async function wsbExecutor(){

    let d = new Date();
    
    let threads = await getRedditThreads();
    console.log(threads);

    //console.log();
    try{
        //wsbScraper();
    }catch (error){
        console.log(error);
    }
}

wsbExecutor();