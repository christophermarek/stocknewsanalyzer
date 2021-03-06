
import axios, { AxiosResponse } from "axios"

let baseUrl: string = "http://localhost:4000"
const isProduction = process.env.REACT_APP_PRODUCTION;
if(isProduction === "TRUE"){
    baseUrl = "https://stock-news-analyze.herokuapp.com"
}

export const getBnnMarketCalls = async (): Promise<AxiosResponse<ApiDataType>> => {
    try{
        const bnnmarketcalls: AxiosResponse<ApiDataType> = await axios.get(
            baseUrl + "/bnnmarketcall"
        )
        return bnnmarketcalls
    }catch (error){
        throw new Error(error)
    }
}

export const getRealTimeCrypto = async (): Promise<AxiosResponse<realtimeApiType>> => {
    try{
        const realtimeData: AxiosResponse<realtimeApiType> = await axios.get(
            baseUrl + "/realtime/crypto"
        )
        return realtimeData
    }catch (error){
        throw new Error(error)
    }
}

export const getRealTimeWsb = async (): Promise<AxiosResponse<realtimeApiType>> => {
    try{
        const realtimeData: AxiosResponse<realtimeApiType> = await axios.get(
            baseUrl + "/realtime/wsb"
        )
        return realtimeData
    }catch (error){
        throw new Error(error)
    }
}

export const getAllFrequencyLists = async (): Promise<AxiosResponse<wsbApiDataType>> => {
    try{
        const allFrequencyLists: AxiosResponse<wsbApiDataType> = await axios.get(
            baseUrl + "/wsb/allFrequencyLists"
        )
        return allFrequencyLists
    }catch (error){
        throw new Error(error)
    }
}
export const getSingleFrequencyList = async (_date: Date): Promise<AxiosResponse<wsbApiDataType>> => {
    try{
        const singleFrequencyList: AxiosResponse<wsbApiDataType> = await axios.get(
            baseUrl + `/wsb/singleFrequencyList/${_date}`
        )
        return singleFrequencyList
    }catch (error){
        throw new Error(error)
    }
}

export const getCryptoCurrencyAllFrequencyLists = async (): Promise<AxiosResponse<cryptoCurrencyApiDataType>> => {
    try{
        const allFrequencyLists: AxiosResponse<cryptoCurrencyApiDataType> = await axios.get(
            baseUrl + "/cryptocurrency/allFrequencyLists"
        )
        return allFrequencyLists
    }catch (error){
        throw new Error(error)
    }
}
export const getCryptoCurrencySingleFrequencyList = async (_date: Date): Promise<AxiosResponse<cryptoCurrencyApiDataType>> => {
    try{
        const singleFrequencyList: AxiosResponse<cryptoCurrencyApiDataType> = await axios.get(
            baseUrl + `/cryptocurrency/singleFrequencyList/${_date}`
        )
        return singleFrequencyList
    }catch (error){
        throw new Error(error)
    }
}

//yahoo stock prices API from our server
export const getCurrentData = async (_ticker: string): Promise<AxiosResponse<yahooStockPricesApiDataType>> => {
    try{
        const currentData: AxiosResponse<ApiDataType> = await axios.get(`${baseUrl}/yahoofinance/current-data/${_ticker}`)
        return currentData
    }catch (error){
        throw new Error(error)
    }
}

export const getCurrentPrice = async (_ticker: string): Promise<AxiosResponse<yahooStockPricesApiDataType>> => {
    try{
        const currentPrice: AxiosResponse<ApiDataType> = await axios.get(`${baseUrl}/yahoofinance/current-price/${_ticker}`)
        return currentPrice
    }catch (error){
        throw new Error(error)
    }
}

export const getHistoricalPrices = async (_startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): Promise<AxiosResponse<yahooStockPricesApiDataType>> => {
    try{
        //yahoofinance/historical-prices/:startMonth/:startDay/:startYear/:endMonth/:endDay/:endYear/:ticker/:frequency
        const historicalPrices: AxiosResponse<ApiDataType> = await axios.get(`${baseUrl}/yahoofinance/historical-prices/${_startMonth}/${_startDay}/${_startYear}/${_endMonth}/${_endDay}/${_endYear}/${_ticker}/${_frequency}`)
        return historicalPrices
    }catch (error){
        throw new Error(error)
    }
}

