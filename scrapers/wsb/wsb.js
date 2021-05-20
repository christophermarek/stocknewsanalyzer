'use strict';
const snoowrap = require('snoowrap');
const dotenv = require("dotenv");

dotenv.config();

function wsbScraper(){

    console.log("running");

    // Create a new snoowrap requester with OAuth credentials.

    const r = new snoowrap({
        userAgent: 'wsb scraper',
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        refreshToken: process.env.REDDIT_REFRESH_TOKEN
    });


    // Extracting every comment on a thread
    r.getSubmission('4j8p6d').expandReplies({limit: 3, depth: 3}).then(console.log)

    //ok need to find what to actually set limit and depth too

    //now i want to find the url for the new daily discussion thread
    //and try to just scrape that first

    //then compare keywords to a stockkeywords list

    //Then save the frequency of each keyword for that thread with the date of the thread & date of parse

    //parse hisstoric threads? maybe separate funciton

    //have features to autoscrape

}

wsbScraper();
