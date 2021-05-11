
import axios, { AxiosResponse } from "axios"

const baseUrl: string = "http://localhost:4000"

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
