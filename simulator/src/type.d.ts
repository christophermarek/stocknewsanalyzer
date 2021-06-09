
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

interface simulatorProps {

}

interface toggleTickersControlProps {
  type: string
  realtimedata: realtimeDataItem[]
}

interface realtimedataProps {

}

interface bnnmarketcallObject {
  bnnmarketcallObject: bnnmarketcall[]
}

interface articleProps {
  articleText: string
  setCurrentArticleViewing: Function
}


interface bnnmarketcallProps {
  bnnmarketcallItem: bnnmarketcall
  setCurrentArticleViewing: Function
}

interface singleTickerDataProps {
  frequencyLists: any
  dataSourceSelected: string
}

interface allFrequencyDataProps {
  frequencyLists: any
}

interface wordFilterControlsProps {
  symbolsToFilter: String[]
  setSymbolsToFilter: any
}

interface SingleTickerQueriesProps {
  selectedTicker: any
  frequencyOverTime: any
  historicalPrices: any
}

interface selectDayControlsProps {
  frequencyLists: any
  setSelectedOneDay: any
  selectedOneDay: any
  setSingleDayFrequencyChartActive: any
  setOneDayFrequencyChartData: any
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

type realtimeDataItem = {
  _id: string,
  frequencyList: any
  sentimentList: any
  createdAt: any
  updatedAt: any
}
type realtimeApiType = {
  message: string
  status: string
  realtimeList: realtimeDataItem
}

type cryptoCurrencyApiDataType = {
  message: string
  status: string
  cryptocurrencyFrequencyLists: cryptoCurrencyFrequencyListItem
}

type cryptoCurrencyFrequencyListItem = {
  _id: string
  freqList: object
  date: Date
  numComments: number
  threadId: string
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