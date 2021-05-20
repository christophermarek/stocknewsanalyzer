import React, { useEffect, useState } from "react";

import { getHistoricalPrices } from "./API"

//SHOULD PROBABLY JUST RENAME THIS TO MARKET SUMMARY PAGE


function Default() {

  const [snp500, setSnp500] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [tsxsnp, setTsxsnp] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [nasdaq, setNasdaq] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [cadUsd, setcadUsd] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [oil, setOil] = useState<Array<yahooStockHistoricalPrices>>([]);

  const [dataFetched, setDataFetched] = useState<boolean>(false);

  //there really is a better way to organize this instead of copy and paste. Should just make a market index component. TODO 
  //like asap fix this 
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

  const fetchNasdaq = (_startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
    //to try and stop too many api calls by accident
    if(!dataFetched){
      //TSX
      getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, '^IXIC', _frequency)
      .then(({ data: { historicalPrices } }: any) => setNasdaq(historicalPrices))
      .catch((err: Error) => console.log(err))
      }
  }

  const fetchCadUsd = (_startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
    //to try and stop too many api calls by accident
    if(!dataFetched){
      //TSX
      getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, 'CADUSD=X', _frequency)
      .then(({ data: { historicalPrices } }: any) => setcadUsd(historicalPrices))
      .catch((err: Error) => console.log(err))
      }
  }

  const fetchOil = (_startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
    //to try and stop too many api calls by accident
    if(!dataFetched){
      //TSX
      getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, 'CL=F', _frequency)
      .then(({ data: { historicalPrices } }: any) => setOil(historicalPrices))
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
    fetchNasdaq(`${yesterday.getMonth()}`, `${yesterday.getDate()}`, `${yesterday.getFullYear()}`, `${today.getMonth()}`, `${today.getDate() + 1}`, `${today.getFullYear()}`, 'none', '1d');
    fetchCadUsd(`${yesterday.getMonth()}`, `${yesterday.getDate()}`, `${yesterday.getFullYear()}`, `${today.getMonth()}`, `${today.getDate() + 1}`, `${today.getFullYear()}`, 'none', '1d');
    fetchOil(`${yesterday.getMonth()}`, `${yesterday.getDate()}`, `${yesterday.getFullYear()}`, `${today.getMonth()}`, `${today.getDate() + 1}`, `${today.getFullYear()}`, 'none', '1d');

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
          <p className={`${Number(tsxsnp[0].close) - Number(tsxsnp[tsxsnp.length-1].close) > 0 ? "green" : "red"}`}>24hr Change: {tsxChange.toFixed(2)} %</p>
      </div>
    )
  
  }

  function renderNasdaq(){
    let tsxv2 = Number(nasdaq[0].close);
    let tsxv1 = Number(nasdaq[nasdaq.length - 1].close);
    let nasdaqChange = ((tsxv2 - tsxv1) / tsxv1) * 100;

    return(
      <div className="summaryContainer">
          <p>Nasdaq</p>
          <p>{`open: ${nasdaq[0].open} close: ${nasdaq[0].close}`}</p>
          <p>{`high: ${nasdaq[0].high} low: ${nasdaq[0].low} volume: ${nasdaq[0].volume}`}</p>
          <p className={`${Number(nasdaq[0].close) - Number(nasdaq[nasdaq.length-1].close) > 0 ? "green" : "red"}`}>24hr Change: {nasdaqChange.toFixed(2)} %</p>
      </div>
    )
  
  }

  function renderCadUsd(){
    let tsxv2 = Number(cadUsd[0].close);
    let tsxv1 = Number(cadUsd[cadUsd.length - 1].close);
    let nasdaqChange = ((tsxv2 - tsxv1) / tsxv1) * 100;

    return(
      <div className="summaryContainer">
          <p>CAD/USD</p>
          <p>{`open: ${cadUsd[0].open} close: ${cadUsd[0].close}`}</p>
          <p>{`high: ${cadUsd[0].high} low: ${cadUsd[0].low} volume: ${cadUsd[0].volume}`}</p>
          <p className={`${Number(cadUsd[0].close) - Number(cadUsd[cadUsd.length-1].close) > 0 ? "green" : "red"}`}>24hr Change: {nasdaqChange.toFixed(2)} %</p>
      </div>
    )
  
  }

  function renderOil(){
    let tsxv2 = Number(oil[0].close);
    let tsxv1 = Number(oil[oil.length - 1].close);
    let nasdaqChange = ((tsxv2 - tsxv1) / tsxv1) * 100;

    return(
      <div className="summaryContainer">
          <p>Crude Oil ($USD)</p>
          <p>{`open: ${oil[0].open} close: ${oil[0].close}`}</p>
          <p>{`high: ${oil[0].high} low: ${oil[0].low} volume: ${oil[0].volume}`}</p>
          <p className={`${Number(oil[0].close) - Number(oil[oil.length-1].close) > 0 ? "green" : "red"}`}>24hr Change: {nasdaqChange.toFixed(2)} %</p>
      </div>
    )
  
  }


  return (
    <div className="marketSummary">
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
      {nasdaq.length > 0 ? (
          renderNasdaq()
        ) : (
        <p>Loading</p>
        )
      }
      {cadUsd.length > 0 ? (
          renderCadUsd()
        ) : (
        <p>Loading</p>
        )
      }
      {oil.length > 0 ? (
          renderOil()
        ) : (
        <p>Loading</p>
        )
      }
    </div>
  );
  
}

export default Default;
