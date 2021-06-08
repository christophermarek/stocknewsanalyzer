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
        //console.log(comments[i].data.body);
        commentsObj[comments[i].data.id] = comments[i].data.body
    }
    return

}


async function realTimeData() {

    let subreddits = ['wallstreetbets', 'cryptocurrency'];

    let comments = {};

    let count = 0;
    let timesToRun = 4;
    let stop = setInterval(async function run() {
        console.log("running interval");
        let firstPage = await getComments(subreddits[0]);
        comments = {...comments, ...firstPage}
        count++;
    }, 15000);
    
    if(count >= timesToRun){
        clearInterval(stop);
        return comments;
    }
}

async function realTimeDataHandler() {
    setInterval(async function run() {
        let comments = await realTimeData();

        now here i analyze Text.
    }, 60000);
}

realTimeDataHandler();