
const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const cheerio = require('cheerio');

function generateCryptoList(){

    let cryptoList = {filepath: '../tickers/coingeckoCryptoTickers.txt', encoding: 'utf8'};
    try {
        let data = fs.readFileSync(cryptoList.filepath, cryptoList.encoding);
        return JSON.parse(data);        
    } catch(e) {
        console.log('Error:', e.stack);
    }

}

async function getFirstArticleId(){
    const { data } = await axios.get(
        `https://old.reddit.com/r/CryptoCurrency/search/?q=flair%3A%22OFFICIAL%22&sort=new&restrict_sr=on&t=all`
    );

    const $ = cheerio.load(data);
    let submissionUrls = [];
    
    $('a').each((i, link) => {
        const href = link.attribs.href;
        if(href != undefined && href[0] == "h" && href[href.length - 1] == '/' && !isNaN(href[href.length - 2])){
            let split = href.split('/');
            let threadId = split[6];
            submissionUrls.push(threadId);
        }
    });

    return submissionUrls[0];
}


async function cryptoCurrency(){
    //dataset for comparison
    let cryptoList = generateCryptoList()
    let firstArticleId = await getFirstArticleId();
    let pagesToSearch = 1;
    let tickerList = cryptoList;

    
    
    
    /*
    id, symbol, name
    */


    
}


cryptoCurrency()