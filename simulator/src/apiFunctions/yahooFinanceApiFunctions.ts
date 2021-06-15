import { getCurrentData, getCurrentPrice, getHistoricalPrices } from '../API'

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