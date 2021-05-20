import React, { useEffect, useState } from "react";

import { getHistoricalPrices } from "./API"

//SHOULD PROBABLY JUST RENAME THIS TO MARKET SUMMARY PAGE


function Default() {

  const [snp500, setSnp500] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [tsxsnp, setTsxsnp] = useState<Array<yahooStockHistoricalPrices>>([]);

  const [dataFetched, setDataFetched] = useState<boolean>(false);

  const fetchHistoricalPrices = (_startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
    //to try and stop too many api calls by accident
    if(!dataFetched){
      //S&P
      getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, '^GSPC', _frequency)
      .then(({ data: { historicalPrices } }: any) => setSnp500(historicalPrices))
      .catch((err: Error) => console.log(err))
    }
  }

  const fetchTSX = (_startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
    //to try and stop too many api calls by accident
    if(!dataFetched){
      //TSX
      getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, '^GSPTSE', _frequency)
      .then(({ data: { historicalPrices } }: any) => setTsxsnp(historicalPrices))
      .catch((err: Error) => console.log(err))
      }
  }
  
  //to calculate daily percent change we just need to fetch the price from yesterday, today
  if((snp500.length < 1  && dataFetched == false)){
    let today = new Date();
    let yesterday = new Date();
    // subtract one day from current time                          
    yesterday.setDate(yesterday.getDate() - 1); 
      
    //we want the S&P 500 and the TSX right now
    //the tickers are the tickers on yahoo
    fetchHistoricalPrices(`${yesterday.getMonth()}`, `${yesterday.getDate()}`, `${yesterday.getFullYear()}`, `${today.getMonth()}`, `${today.getDate() + 1}`, `${today.getFullYear()}`, 'none', '1d');
    fetchTSX(`${yesterday.getMonth()}`, `${yesterday.getDate()}`, `${yesterday.getFullYear()}`, `${today.getMonth()}`, `${today.getDate() + 1}`, `${today.getFullYear()}`, 'none', '1d');
    //to prevent too many calls to my api server by accident
    setDataFetched(true);
  }

  function renderMarketSummaries(){

    let snpv2 = Number(snp500[0].close);
    let snpv1 = Number(snp500[snp500.length - 1].close);
    let snpChange = ((snpv2 - snpv1) / snpv1) * 100;

    return(
      
      <div className="summaryContainer">
            <p>S&P 500</p>
            <p>{`open: ${Number(snp500[0].open).toFixed(2)} close: ${Number(snp500[0].close).toFixed(2)}`}</p>
            <p>{`high: ${Number(snp500[0].high).toFixed(2)} low: ${Number(snp500[0].low).toFixed(2)} volume: ${Number(snp500[0].volume).toFixed(2)}`}</p>
            <p className={`${Number(snp500[0].close) - Number(snp500[snp500.length-1].close) > 0 ? "green" : "red"}`}>24hr Change: {snpChange.toFixed(2)} %</p>
      </div>
    )
    
  }

  function renderTsxSummary(){
    let tsxv2 = Number(tsxsnp[0].close);
    let tsxv1 = Number(tsxsnp[tsxsnp.length - 1].close);
    let tsxChange = ((tsxv2 - tsxv1) / tsxv1) * 100;

    return(
      <div className="summaryContainer">
          <p>TSX/SNP</p>
          <p>{`open: ${tsxsnp[0].open} close: ${tsxsnp[0].close}`}</p>
          <p>{`high: ${tsxsnp[0].high} low: ${tsxsnp[0].low} volume: ${tsxsnp[0].volume}`}</p>
          <p className={`${Number(tsxsnp[0].close) - Number(tsxsnp[tsxsnp.length-1].close) > 0 ? "green" : "red"}`}>24hr Change: {tsxChange.toFixed()} %</p>
      </div>
    )
    
  }

  return (
    <div className="marketSummary">
      <p>Markets Summary</p>
      {snp500.length > 0 ? (
        renderMarketSummaries()
      ) : (
        <p>Loading</p>
      )
      }
      {tsxsnp.length > 0 ? (
          renderTsxSummary()
        ) : (
        <p>Loading</p>
        )
      }
    </div>
  );
  
}

export default Default;
