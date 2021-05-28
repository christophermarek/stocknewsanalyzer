'use strict';
const snoowrap = require('snoowrap');
const dotenv = require("dotenv");
const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const { wsb } = require('./wsbModel');

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

async function getCommentIds(threadId){

    const timer = ms => new Promise(res => setTimeout(res, ms))

    let counter = 0;
    let maxTries = 100;
    console.log(`fetching thread ${threadId}`);
    while(counter < maxTries){
        try{
            const { data } = await axios.get(
                `https://api.pushshift.io/reddit/submission/comment_ids/${threadId}`
            );
            
            return data.data;
            
        }catch(error){ 
            const rndInt = Math.floor(Math.random() * 30) + 1;
            console.log(`Error fetching ids' for ${threadId}, rate limited probably at counter: ${counter} waiting ${rndInt} seconds to try again on`); 
            await timer(rndInt * 1000);
        }
    }


}

async function getCommentText(commentIdStrings){
    //console.log("hello");
    //console.log(commentIdStrings);

    const timer = ms => new Promise(res => setTimeout(res, ms))

    let counter = 0;
    let sizeCommentIds = commentIdStrings.length;
    let commentTextList = [];
    console.log(`${sizeCommentIds} comment blocks to fetch`);
    while(counter < sizeCommentIds){
        try{
            //console.log(commentIdStrings[i]);
            const { data } = await axios.get(
                `https://api.pushshift.io/reddit/comment/search?ids=${commentIdStrings[counter]}`
            );
            //console.log(data);
            //clean data
            for(let j = 0; j < data.data.length; j++){
                //console.log(`i: ${i} comment number: ${j} ${data.data[j].body}`);
                commentTextList.push({createdAtUTC: data.data[j].created_utc, text: data.data[j].body});
            }
            counter = counter + 1;
        }catch(error){ 
            const rndInt = Math.floor(Math.random() * 30) + 1;
            console.log(`Error fetching commentText, rate limited probably at counter: ${counter} going to ${sizeCommentIds}, waiting ${rndInt} seconds to try again on, thread ${commentIdStrings.length}`); 
            await timer(rndInt * 1000);
        }
    }


    return commentTextList;
}


//Cheerio implementation cant go back far enough
async function getRedditThreads(threadId){
    const { data } = await axios.get(
        `https://old.reddit.com/r/wallstreetbets/search?q=flair%3ADaily+Discussion&restrict_sr=on&sort=relevance&t=all&after=t3_${threadId}`
    );

    const $ = cheerio.load(data);
    let submissionUrls = [];


    $('a').each((i, link) => {
        //console.log(link.attribs.href);
        
        const href = link.attribs.href;
        if(href != undefined && href[0] == "h" && href[href.length - 1] == '/' && !isNaN(href[href.length - 2])){
            let splitForDate = href.split('_');
            if(splitForDate.length == 7){
                let month = splitForDate[4];
                let day = splitForDate[5];
                let year = splitForDate[6].slice(0, -1);

                let monthArray = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
                //var time1 = new Date(arr1[0], arr1[1]-1, arr1[2]); // year, month, day
                let date = new Date(year, monthArray.indexOf(month.toUpperCase()), day);
                submissionUrls.push({articleId: href, date: date});
            }
            
        }
        
    });

    //console.log(submissionUrls);
    

    return submissionUrls;
}


async function wsbScraper(threadData){

    let threadId = threadData.articleId;
    let threadDate = threadData.date;
    //console.log(threadDate);

    let foundCurrentEntry = await wsb.findOne({date: threadDate});
	if(foundCurrentEntry != null){
		console.log("thread already posted to db");
        return 1;
    }

    
    console.log(`thread: ${threadId} date: ${threadDate}`);
    console.log("generating ticker list")
    let tickerList = generateTickerList();

    // Create a new snoowrap requester with OAuth credentials.

    console.log("fetching comment ids");
    let commentIds = await getCommentIds(threadId);
    //console.log(commentIds);
    console.log("fetched comment ids");

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

    console.log("getting comment texts");
    //ok why is it not fetching this properly f
    //console.log(commentIdStrings);
    
    
    
    let commentTextList = await getCommentText(commentIdStrings);

    console.log("fetched comment texts");

    //this site gets us all the comment id's, we need this because the reddit api will 
    //block us because there are too many comments to request at once.

    // Extracting every comment on a thread

    //now i want to find the url for the new daily discussion thread
    //and try to just scrape that first

    //create dict for each ticker tickersMentioned[ticker] = count

    //then compare keywords to a stockkeywords list
    let frequencyList = {}    

    //Then save the frequency of each keyword for that thread with the date of the thread & date of parse
    let sizeOfCommentList = commentTextList.length;
    console.log("generating frequency list")
    for(let i = 0; i < sizeOfCommentList; i++){
        //regex is to split strings but not include whitespace
        let tokens = commentTextList[i].text.split(" ");
        for(let j = 0; j < tokens.length; j++){
            let token = tokens[j].toLowerCase().trim();
            if(token.charAt(0) == '$'){
                token = token.slice(1);
            }
            if(tickerList.includes(token)){
                //console.log(token);
                if(frequencyList[token] == undefined){
                    frequencyList[token] = 1;
                }else{
                    frequencyList[token] += 1;
                }
            }
        }
        
    }

    //console.log(frequencyList);
    //can dump this whole thing to db since it is only 640 lines and 8kb. So i can run this script 125 times until i use a mb on average since each daily has about the same amount of comments.
    //mongodb i have 512 mb of storage so I can run this script for 64000 times. 

    //have features to autoscrape

    console.log("posting to db");

    let dbData = {freqList: frequencyList, date: threadDate};
    //console.log(dbData);
    //figure out how to post to db just look at other scraper

    try {
        wsb.create(dbData, function (err, entry) {
            //empty callback
            console.log("successfully pushed to db");
            return 1;
        });
    } catch (err) {
        console.log(err);
        return 1;
    }
    
}

async function wsbExecutor(articleId, pagesToSearch){

    let d = new Date();

    let firstArticleUrl = articleId;
    
    let threads = [];

    //let newThreads = await getRedditThreads();
    //console.log(newThreads);

    let lastArticleOfPage = firstArticleUrl;

    console.log("Fetching reddit threads")
    for(let i = 0; i < pagesToSearch; i++){
        let newThreads = await getRedditThreads(lastArticleOfPage);
        for(let n = 0; n < newThreads.length; n++){
            threads.push(newThreads[n]);
        }

        //the next page starts at the last article

        //so we want to get the last article id to pass as params for next request
        //so get last article id
        
        let lastArticle = threads[threads.length-1].articleId;
        //console.log(lastArticle);
        let splitUrl = lastArticle.split("/");
        
        //console.log("Last Article " + lastArticle);
        lastArticleOfPage = splitUrl[6];
    }

    let duplRemoved = [];

    //OK NOW REMOVE DUPLICATES FROM THREADS
    //just delete every second one because those are the duplicates
    console.log("removing duplicates");
    let size = threads.length;
    for(let i = 0; i < size; i = i + 2){
        duplRemoved.push(threads[i]);
    }


    //THEN SORT THREADS BY THE DAY,MONTH,YEAR

    console.log("sorting by date")
    function sortArticles(a, b) {
        //new Date(year, monthIndex, day)
        //a = new Date(a.year, monthArray.indexOf(a.))
        return  a.date - b.date;
      }

    duplRemoved.sort(sortArticles);

    
    console.log("sorted array of urls");
    //get the submission ids from each url in order
    //can just transform the array 
    let size2 = duplRemoved.length;
    let urlCleaned = duplRemoved;
    for(let i = 0; i < size2; i++){

        let splitForArticleId = duplRemoved[i].articleId.split("/");
        //console.log(splitForArticleId[6]);
        urlCleaned[i].articleId = splitForArticleId[6];
    }

    console.log("converted to only submissionId's");
    console.log(`Fetched: ${urlCleaned.length} threads`);

    
    console.log("now sending each thread id to main function to parse and post data for that thread");

    //console.log(urlCleaned);
    for(let i = 0; i < size2; i++){
        //this will run async so size2 threads created.
        wsbScraper(urlCleaned[i]);

    }
    
    //would be nice to see how many active are running every like 30 seconds, but idk how to do that. Seems more trouble than its worth but its the only 
    //way to estimate how close until the scrapers are done.
    
    //console.log after each step has been completed so i can monitor script progress

    console.log("scrape complete");
    //process.exit(1);



}

async function dailyScrape(){
    let dbURI = process.env.MONGO_URI_DEV;

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


    //this will be called every 24 hours. 
    //we want the most recent thread url, and we can just get the rest from there since we skip duplicates already so itll just keep it updated.
    //and itll only be the first page so only 25 entries.

    //body > div.content > div.listing.search-result-listing > div > div > div:nth-child(1) > div > header > a

    let pagesToSearch = 1;
    let threadUrl = '';

    //this is the same as the get reddit threads but no thread id to go before. 
    const { data } = await axios.get(
        `https://old.reddit.com/r/wallstreetbets/search/?q=flair%3A%22Daily+Discussion%22&sort=new&restrict_sr=on`
    );

    const $ = cheerio.load(data);
    let submissionUrls = [];

    $('a').each((i, link) => {
        //console.log(link.attribs.href);
        
        const href = link.attribs.href;
        if(href != undefined && href[0] == "h" && href[href.length - 1] == '/' && !isNaN(href[href.length - 2])){
            let splitForDate = href.split('_');
            if(splitForDate.length == 7){
                let month = splitForDate[4];
                let day = splitForDate[5];
                let year = splitForDate[6].slice(0, -1);

                let monthArray = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
                //var time1 = new Date(arr1[0], arr1[1]-1, arr1[2]); // year, month, day
                let date = new Date(year, monthArray.indexOf(month.toUpperCase()), day);
                submissionUrls.push({articleId: href, date: date});
            }
            
        }
        
    });

    threadUrl = submissionUrls[0];
    let splitForId = threadUrl.articleId.split("/");
    let articleId = splitForId[6];
    
    wsbExecutor(articleId, pagesToSearch);
}

module.exports = {
    dailyScrape
};

//wsbScraper({articleId: 'ng1nlz'})