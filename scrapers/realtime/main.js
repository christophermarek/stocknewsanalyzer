const axios = require('axios');

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
            console.log("running interval");
            let firstPage = await getComments(subreddits[0]);
            console.log(firstPage);
            comments = { ...comments, ...firstPage }

            count++;
            console.log(comments);
            if (count >= timesToRun) {
                clearInterval(stop);
                resolve(comments);
            }


        }, 7500);

        

    });

}

async function realTimeDataHandler() {
    console.log("real time data scraper started");
    
    //so this will post to db once a minute
    const durInMinutes = 1;
    for(let i = 0; i < durInMinutes; i++){
    let comments = await realTimeData();
        console.log(comments);
    }

    //stops when dyno gets reset every 24 hrs.
}

realTimeDataHandler();