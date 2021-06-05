
const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const { cryptocurrency } = require('./cryptocurrencyModel');
dotenv.config();

function generateCryptoList() {

    let cryptoList = { filepath: '../tickers/coingeckoCryptoTickers.txt', encoding: 'utf8' };
    try {
        let data = fs.readFileSync(cryptoList.filepath, cryptoList.encoding);

        let parsedData = JSON.parse(data);
        let size = parsedData.length;

        let tickerList = [];

        for (let i = 0; i < size; i++) {
            //can check for occurences of name and coin name
            tickerList.push(parsedData[i].symbol);
            tickerList.push(parsedData[i].name);
        }

        return tickerList;
    } catch (e) {
        console.log('Error:', e.stack);
    }

}

async function getFirstArticleId() {
    const { data } = await axios.get(
        `https://old.reddit.com/r/CryptoCurrency/search/?q=flair%3A%22OFFICIAL%22&sort=new&restrict_sr=on&t=all`
    );

    const $ = cheerio.load(data);
    let submissionUrls = [];

    $('a').each((i, link) => {
        const href = link.attribs.href;
        if (href != undefined && href[0] == "h" && href[href.length - 1] == '/' && !isNaN(href[href.length - 2])) {
            let split = href.split('/');
            let threadId = split[6];
            submissionUrls.push(threadId);
        }
    });

    return submissionUrls[0];
}

//Cheerio implementation cant go back far enough
async function getRedditThreads(threadId) {
    const { data } = await axios.get(
        `https://old.reddit.com/r/CryptoCurrency/search?q=flair%3A%22OFFICIAL%22&restrict_sr=on&sort=new&t=all&after=t3_${threadId}`
    );

    const $ = cheerio.load(data);
    let submissionUrls = [];

    $('a').each((i, link) => {

        const href = link.attribs.href;
        if (href != undefined && href[0] == "h" && href[href.length - 1] == '/' && !isNaN(href[href.length - 2])) {
            let split = href.split("/");
            let threadId = split[6];
            let dateString = split[7];

            let dateeSplit = dateString.split("_");

            if (dateeSplit.length < 6) {
                //skip it because the other thread possible here is the monthly skeptics, and im skipping those
                //apparently this will work and wont end the loop since its foreach.
                return;
            }

            let month = dateeSplit[2];
            let day = dateeSplit[3];
            let year = dateeSplit[4];

            let monthArray = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
            //var time1 = new Date(arr1[0], arr1[1]-1, arr1[2]); // year, month, day
            let date = new Date(year, monthArray.indexOf(month.toUpperCase()), day);
            submissionUrls.push({ articleId: href, date: date });

        }

    });

    return submissionUrls;
}

async function getCommentIds(threadId) {

    const timer = ms => new Promise(res => setTimeout(res, ms))

    let counter = 0;
    let maxTries = 100;
    console.log(`cc fetching thread ${threadId}`);
    while (counter < maxTries) {
        try {
            const { data } = await axios.get(
                `https://api.pushshift.io/reddit/submission/comment_ids/${threadId}`
            );
            return data.data;

        } catch (error) {
            const rndInt = Math.floor(Math.random() * 30) + 1;
            console.log(`cc Error fetching ids' for ${threadId}, rate limited probably at counter: ${counter} waiting ${rndInt} seconds to try again on`);
            await timer(rndInt * 1000);
        }
    }


}

async function getCommentText(commentIdStrings) {
    const timer = ms => new Promise(res => setTimeout(res, ms))
    let counter = 0;
    let sizeCommentIds = commentIdStrings.length;
    let commentTextList = [];
    console.log(`cc ${sizeCommentIds} comment blocks to fetch`);
    while (counter < sizeCommentIds) {
        try {
            const { data } = await axios.get(
                `https://api.pushshift.io/reddit/comment/search?ids=${commentIdStrings[counter]}`
            );
            //clean data
            for (let j = 0; j < data.data.length; j++) {
                commentTextList.push({ createdAtUTC: data.data[j].created_utc, text: data.data[j].body });
            }
            counter = counter + 1;
        } catch (error) {
            const rndInt = Math.floor(Math.random() * 30) + 1;
            console.log(`cc Error fetching commentText, rate limited probably at counter: ${counter} going to ${sizeCommentIds}, waiting ${rndInt} seconds to try again on, thread ${commentIdStrings.length}`);
            await timer(rndInt * 1000);
        }

    }

    return commentTextList;
}

async function getAllThreadIds(firstArticleId, pagesToSearch) {
    let d = new Date();

    let threads = [];

    console.log("cc Fetching reddit threads")
    for (let i = 0; i < pagesToSearch; i++) {
        let newThreads = await getRedditThreads(firstArticleId);
        for (let n = 0; n < newThreads.length; n++) {
            threads.push(newThreads[n]);
        }
        //so get last article id
        let lastArticle = threads[threads.length - 1].articleId;
        //console.log(lastArticle);
        let splitUrl = lastArticle.split("/");
        firstArticleId = splitUrl[6];
    }

    let duplRemoved = [];

    //OK NOW REMOVE DUPLICATES FROM THREADS
    //just delete every second one because those are the duplicates
    console.log("cc removing duplicates");
    let size = threads.length;
    for (let i = 0; i < size; i = i + 2) {
        duplRemoved.push(threads[i]);
    }


    //THEN SORT THREADS BY THE DAY,MONTH,YEAR
    console.log("cc sorting by date")
    function sortArticles(a, b) {
        //new Date(year, monthIndex, day)
        //a = new Date(a.year, monthArray.indexOf(a.))
        return a.date - b.date;
    }
    duplRemoved.sort(sortArticles);

    console.log("cc sorted array of urls");
    //get the submission ids from each url in order
    //can just transform the array 
    let size2 = duplRemoved.length;
    let urlCleaned = duplRemoved;
    for (let i = 0; i < size2; i++) {

        let splitForArticleId = duplRemoved[i].articleId.split("/");
        urlCleaned[i].articleId = splitForArticleId[6];
    }

    console.log("cc converted to only submissionId's");
    console.log(`cc Fetched: ${urlCleaned.length} threads`);
    return urlCleaned;

}

async function getThreadCommentsAndPost(threadData, tickerList) {

    let threadId = threadData.articleId;
    let threadDate = threadData.date;

    console.log(`cc fetching comment ids`);
    let commentIds = await getCommentIds(threadId);
    console.log("cc fetched comment ids");

    let foundCurrentEntry = await cryptocurrency.findOne({ date: threadDate });
    if (foundCurrentEntry != null) {
        console.log("cc thread already posted to db");
        if (foundCurrentEntry.numComments >= commentIds.length) {
            console.log("cc duplicate thread");
            return 1;
        } else {
            console.log("cc continuing scrape since there are new comments");
        }
    }

    //the comment id string must be less than 2048 per request or the server wont be able to handle it
    //i got a 414 error and im just assuming 2048 because that is url length limit of most browsers
    let commentIdStrings = [];
    let commentIdString = "";

    for (let i = 0; i < commentIds.length; i++) {
        //max url length is 2048, most of the time
        if (commentIdString.length > 2040) {
            //del last comma
            if (commentIdString.charAt(commentIdString.length - 1) == ",") {
                commentIdString = commentIdString.slice(0, -1);
            }
            commentIdStrings.push(commentIdString);
            commentIdString = "";
        }

        //no commma last line
        if (i == commentIds.length - 1) {
            commentIdString += commentIds[i];
        } else {
            commentIdString += commentIds[i] + ",";
        }
    }

    console.log("cc getting comment texts");
    let commentTextList = await getCommentText(commentIdStrings);
    console.log("cc fetched comment texts");

    let frequencyList = {}

    //Then save the frequency of each keyword for that thread with the date of the thread & date of parse
    let sizeOfCommentList = commentTextList.length;

    console.log("cc generating frequency list")
    for (let i = 0; i < sizeOfCommentList; i++) {
        //regex is to split strings but not include whitespace
        let tokens = commentTextList[i].text.split(" ");
        for (let j = 0; j < tokens.length; j++) {
            let token = tokens[j].toLowerCase().trim();
            if (token.charAt(0) == '$') {
                token = token.slice(1);
            }
            if (tickerList.includes(token)) {
                if (frequencyList[token] == undefined) {
                    frequencyList[token] = 1;
                } else {
                    frequencyList[token] += 1;
                }
            }
        }

    }
    //console.log(frequencyList)

    if (Object.keys(frequencyList).length === 0) {
        console.log("skipping entry, empty frequency list");
    } else {
        console.log("cc posting to db");
        let dbData = { freqList: frequencyList, date: threadDate, numComments: commentIds.length, threadId: threadId };

        try {
            if (foundCurrentEntry != null) {
                console.log("cc overwritting data");
                foundCurrentEntry = dbData;
                foundCurrentEntry.save();
            } else {
                cryptocurrency.create(dbData, function (err, entry) {
                    //empty callback
                    console.log("cc successfully pushed to db");
                    return 1;
                });
            }
        } catch (err) {
            console.log(err);
            return 1;
        }
    }
}

async function cryptoCurrency() {

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
            console.log('cc MongoDB Connected...');
        })
        .catch((err) => console.log(err));

    //dataset for comparison
    let cryptoList = generateCryptoList()
    let firstArticleId = await getFirstArticleId();
    let pagesToSearch = 25;

    //DONT COPY WSB ONES, CAN DO THEIR EXECUTOR FUNCTION JUST INSIDE OF HERE,
    //WITH BETTER CODE SPLITTING SINCE NOW I KNOW WHAT TO DO

    let threads = await getAllThreadIds(firstArticleId, pagesToSearch);

    /*
    id, symbol, name
    */


    console.log("cc now sending each thread id to main function to parse and post data for that thread");


    let size = threads.length;
    for (let i = 0; i < size; i++) {
        getThreadCommentsAndPost(threads[i], cryptoList);
    }


    //getThreadCommentsAndPost(threads[0], cryptoList);

    console.log("cc scrape complete");

}


cryptoCurrency()