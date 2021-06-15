import React from "react";

type Props = marketSummaryProps;

const Default: React.FC<Props> = ({ snp500, tsxsnp, nasdaq, cadUsd, oil, btc, eth, dataFetched }) => {

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

  const renderCryptoSummary = (cryptoData: any, summaryTitle: string) => {

    if (cryptoData.prices !== undefined) {
      let today = Number(cryptoData.prices[0][1]);
      let yesterday = Number(cryptoData.prices[1][1]);
      let change = ((today - yesterday) / yesterday) * 100;
      return (
        <div className="summaryContainer">
          <p>{summaryTitle}</p>
          <p>{`Price: ${cryptoData.prices[1][1]}`}</p>
          <p>{`Market Cap: ${cryptoData.market_caps[1][1]} volume: ${cryptoData.total_volumes[1][1].volume}`}</p>
          <p className={change > 0 ? "green" : "red"}>24hr Change: {change.toFixed(2)} %</p>
        </div>
      )

    }

  }

  return (
    <>
      <p>(Reminder)If it is monday the 24 hour change will be 0.00% for markets that are closed on sunday</p>

      <div >
        <p className="marketTitle">US Market</p>
        <div className="marketSummaryTab">
          {snp500.length > 0 ? (
            renderSummary(snp500, 'S&P500')
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
          {oil.length > 0 ? (
            renderSummary(oil, 'Crude Oil ($USD)')
          ) : (
            <p>Loading</p>
          )
          }
        </div>
      </div>

      <div >
        <p className="marketTitle">Canadian Market</p>
        <div className="marketSummaryTab">
          {tsxsnp.length > 0 ? (
            renderSummary(tsxsnp, 'TSX/SNP')
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
        </div>
      </div>

      <div >
        <p className="marketTitle">Crypto  Market</p>
        <div className="marketSummaryTab">
          {btc !== undefined ? (
            renderCryptoSummary(btc, 'BTC/USD')
          ) : (
            <p>Loading</p>
          )
          }
          {eth !== undefined ? (
            renderCryptoSummary(eth, 'ETH/USD')
          ) : (
            <p>Loading</p>
          )
          }
        </div>
      </div>
    </>
  );

}

export default Default;
