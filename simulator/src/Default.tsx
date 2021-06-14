import React, { forwardRef, useEffect, useState } from "react";

import { getHistoricalPrices } from "./API"

//SHOULD PROBABLY JUST RENAME THIS TO MARKET SUMMARY PAGE


function Default() {

  const [snp500, setSnp500] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [tsxsnp, setTsxsnp] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [nasdaq, setNasdaq] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [cadUsd, setcadUsd] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [oil, setOil] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  const fetchSummary = (name: string, _startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
    //to try and stop too many api calls by accident
    if (!dataFetched) {
      //TSX
      getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, name, _frequency)
        .then(({ data: { historicalPrices } }: any) => setSummary(name, historicalPrices))
        .catch((err: Error) => console.log(err))
    }
  }

  const setSummary = (name: string, data: yahooStockHistoricalPrices[]) => {
    switch (name) {
      case 'CL=F':
        setOil(data);
        break;
      case 'CADUSD=X':
        setcadUsd(data);
        break;
      case '^IXIC':
        setNasdaq(data);
        break;
      case '^GSPTSE':
        setTsxsnp(data);
        break;
      case '^GSPC':
        setSnp500(data);
        break;
    }

  }

  //to calculate daily percent change we just need to fetch the price from yesterday, today
  if ((snp500.length < 1 && dataFetched == false)) {
    let today = new Date();
    let yesterday = new Date();
    // subtract one day from current time                          
    yesterday.setDate(yesterday.getDate() - 1);

    let tickersToFetch = ['CL=F', 'CADUSD=X', '^IXIC', '^GSPTSE', '^GSPC']
    let size = tickersToFetch.length;
    for (let i = 0; i < size; i++) {
      fetchSummary(tickersToFetch[i], `${yesterday.getMonth()}`, `${yesterday.getDate()}`, `${yesterday.getFullYear()}`, `${today.getMonth()}`, `${today.getDate() + 1}`, `${today.getFullYear()}`, 'none', '1d')
    }

    //to prevent too many calls to my api server on rerenders
    setDataFetched(true);
  }

  const renderSummary = (summaryData: yahooStockHistoricalPrices[], summaryTitle: string) => {
    let today = Number(summaryData[0].close);
    let yesterday = Number(summaryData[summaryData.length - 1].close);
    let change = ((today - yesterday) / yesterday) * 100;

    return (
      <div className="summaryContainer">
        <p>{summaryTitle}</p>
        <p>{`open: ${summaryData[0].open} close: ${summaryData[0].close}`}</p>
        <p>{`high: ${summaryData[0].high} low: ${summaryData[0].low} volume: ${summaryData[0].volume}`}</p>
        <p className={`${Number(summaryData[0].close) - Number(summaryData[summaryData.length - 1].close) > 0 ? "green" : "red"}`}>24hr Change: {change.toFixed(2)} %</p>
      </div>
    )
  }

  return (
    <>
      <p>(Reminder)If it is monday the 24 hour change will be 0.00% for markets that are closed on sunday</p>

      <div className="marketSummary">
        <p className="marketTitle">US Markets</p>
        {snp500.length > 0 ? (
          renderSummary(snp500, 'S&P500')
        ) : (
          <p>Loading</p>
        )
        }
        {tsxsnp.length > 0 ? (
          renderSummary(tsxsnp, 'TSX/SNP')
        ) : (
          <p>Loading</p>
        )
        }
        {nasdaq.length > 0 ? (
          renderSummary(nasdaq, 'Nasdaq')
        ) : (
          <p>Loading</p>
        )
        }
        {cadUsd.length > 0 ? (
          renderSummary(cadUsd, 'CAD/USD')
        ) : (
          <p>Loading</p>
        )
        }
        {oil.length > 0 ? (
          renderSummary(oil, 'Crude Oil ($USD)')
        ) : (
          <p>Loading</p>
        )
        }
      </div>
    </>
  );

}

export default Default;
