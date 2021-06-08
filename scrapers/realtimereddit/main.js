
//returns object with array and id of last thread of page
async function getCommentsFirstPage(subreddit) {

    const { data } = await axios.get(
        `https://old.reddit.com/r/${subreddit}/comments.json`
    );
    console.log(`https://old.reddit.com/r/${subreddit}/comments.json`);


}

//returns array of comment text and id of last thread of page 
async function getCommentsAfterFirstPage(subreddit, threadId) {

    const { data } = await axios.get(
        `https://old.reddit.com/r/CryptoCurrency/search?q=flair%3A%22OFFICIAL%22&restrict_sr=on&sort=new&t=all&after=t3_${threadId}`
    );


}

function realTimeData() {

    let subreddits = ['wallstreetbets', 'cryptocurrency'];

    getCommentsFirstPage(subreddits[0]);
    
    //then start interval
    /*
    let interval = 15 * 60000;

    setInterval(function run() {
        console.log("running interval");
        wsbScraper(threadData, tickerList, true);
    }, interval);
    */
}

realTimeData();