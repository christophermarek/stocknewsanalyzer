import { getCurrentData, getCurrentPrice, getHistoricalPrices } from '../API'


//fetchCurrentData("AAPL")
//fetchCurrentPrice("AAPL")
//fetchHistoricalPrices('0', '6', '2020', '0', '8', '2020', 'AAPL', '1d')

export const fetchHistoricalPrices = (_startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
    getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, _ticker, _frequency)
    .then(({ data: { historicalPrices } }: any) => console.log(historicalPrices))
    .catch((err: Error) => console.log(err))
  }

export const fetchCurrentPrice = (_ticker: string): void => {
    getCurrentPrice(_ticker)
    .then(({ data: { currentPrice } }: any) => console.log(currentPrice))
    .catch((err: Error) => console.log(err))
  }
  
export const fetchCurrentData = (_ticker: string): void => {
    getCurrentData(_ticker)
    .then(({ data: { currentData } }: any) => console.log(currentData))
    .catch((err: Error) => console.log(err))
  }