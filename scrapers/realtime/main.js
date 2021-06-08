const axios = require('axios');
const natural = require('natural');
const aposToLexForm = require('apos-to-lex-form');
const SW = require('stopword');
const { realtimeWsb, realtimeCrypto } = require('./realtimedataModel');
const mongoose = require('mongoose');

//returns object with key id and value text
async function getComments(subreddit) {

    const { data } = await axios.get(
        `https://old.reddit.com/r/${subreddit}/comments.json`
    );
    //console.log(`https://old.reddit.com/r/${subreddit}/comments.json`);
    let comments = data.data.children;
    //console.log(comments)

    let commentsObj = {};
    let size = comments.length;
    for (let i = 0; i < size; i++) {
        commentsObj[comments[i].data.id] = comments[i].data.body
    }
    return commentsObj;

}

//this function collects comments for 1 min, 0.25 min a time
const realTimeData = async () => {

    let subreddits = ['wallstreetbets', 'cryptocurrency'];
    return new Promise((resolve, reject) => {
        let comments = {};

        let count = 0;
        //runs every 1/8 min, pls dont rate limit me
        let timesToRun = 8;
        let stop = setInterval(async function run() {
            //console.log("running interval");
            let firstPage = await getComments(subreddits[0]);
            comments = { ...comments, ...firstPage }

            count++;
            //console.log(comments);
            if (count >= timesToRun) {
                clearInterval(stop);
                resolve(comments);
            }


        }, 7500);



    });

}

const getSentiment = (wordList) => {
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = analyzer.getSentiment(wordList);
    return analysis
}

const cleanComment = (dirtyWord) => {

    //remove contractions
    const lexedReview = aposToLexForm(dirtyWord);
    //tolower
    const casedReview = lexedReview.toLowerCase();
    //remove all non alphabet characters, hope no tickers have - in them
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

    //natural library
    const { WordTokenizer } = natural;
    //split to tokens
    const tokenizer = new WordTokenizer();
    //library custom makes tokens
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

    //stopwords are useless words, like but, a, or, what
    const filteredReview = SW.removeStopwords(tokenizedReview);

    return filteredReview;
}

async function realTimeDataHandler(tickerList, cryptoList) {

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
            //DELETE ALL ENTRIES BECAUSE THIS WILL MAKE 1440 DOCUMENTS IF STARTED AT THE BEGGINING OF THE DAY
            console.log('wsb MongoDB Connected...');
            realtimeWsb.deleteMany({}, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('success deleting all entries');
                }
            }
            );
        })
        .catch((err) => console.log(err));

    let listToCompare = tickerList;
    //console.log(listToCompare);
    console.log("real time data scraper started");

    //so this will post to db once a minute
    const durInMinutes = 100;
    for (let i = 0; i < durInMinutes; i++) {
        let comments = await realTimeData();
        //sentiment analysis without messing up the tickers
        //trying to clean text before adding to frequency list
        let frequencyList = {};
        let sentimentList = {};
        for (const [key, value] of Object.entries(comments)) {
            let cleanedCommentList = cleanComment(value);
            let size = cleanedCommentList.length;
            for (let n = 0; n < size; n++) {
                if (listToCompare.includes(cleanedCommentList[n])) {
                    let sentiment = getSentiment(cleanedCommentList);
                    if (frequencyList[cleanedCommentList[n]] == undefined) {
                        frequencyList[cleanedCommentList[n]] = 1;
                        sentimentList[cleanedCommentList[n]] = [sentiment];
                    } else {
                        frequencyList[cleanedCommentList[n]] += 1;
                        sentimentList[cleanedCommentList[n]].push(sentiment);
                    }
                }
            }
            //console.log((`sentiment ${sentiment} for word ${value}`));
        }
        //console.log(frequencyList);
        //console.log(sentimentList);
        //dont do sentiment analysis if word isnt in frequency list, then create object
        //maybe just use a new model like create a new one cause the old one is a mess
        realtimeWsb.create({frequencyList: frequencyList, sentimentList: sentimentList}, function (err, entry) {
            if(err){
                console.log(err)
            }else{
                //empty callback
                console.log("wsb realtime successfully pushed to db");
            }
            
        });
        console.log(`posted to db, at iteration num: ${i}`);
    }

    //stops when dyno gets reset every 24 hrs.
}

module.exports = {
    realTimeDataHandler
};
