
interface bnnmarketcall {
  _id: string
  month: string
  day: string
  guest: string
  picks: pick[]
  date: date
  focus: string
  text: string
  createdAt?: string
  updatedAt?: string
}

interface simulatorProps{
  
}

interface bnnmarketcallObject {
  bnnmarketcallObject: bnnmarketcall[]
}

interface articleProps{
  articleText: string
  setCurrentArticleViewing: Function
}
 

interface bnnmarketcallProps {
  bnnmarketcallItem: bnnmarketcall 
  setCurrentArticleViewing: Function
}

type ApiDataType = {
  message: string
  status: string
  bnnmarketcalls: bnnmarketcall[]
  bnnmarketcall?: bnnmarketcall
}

type yahooStockPricesApiDataType = {
  message: string
  status: string
  currentData?: any
  currentPrice?: any
  historicalPrice?: any
}

type wsbApiDataType = {
  message: string
  status: string
  wsbFrequencyLists?: wsbFrequencyListItem[]
}

type wsbFrequencyListItem = {
  _id: string
  freqList: object
  date: Date
}

interface historicalPrices {
  historicalPrices: yahooStockHistoricalPrices[]
}

type yahooStockHistoricalPrices = {
  adjclose: string
  close: string
  date: any
  high: string
  low: string
  open: string
  volume: string
} 



type areaSeriesType = {
  time: number
  value: number
}