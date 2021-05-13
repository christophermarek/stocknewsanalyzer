import { getCurrentData, getCurrentPrice, getHistoricalPrices } from '../API'


//fetchCurrentData("AAPL")
//fetchCurrentPrice("AAPL")
//fetchHistoricalPrices('0', '6', '2020', '0', '8', '2020', 'AAPL', '1d')




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