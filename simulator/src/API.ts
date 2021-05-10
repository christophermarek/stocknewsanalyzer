
import axios, { AxiosResponse } from "axios"

const baseUrl: string = "http://localhost:4000"

export const getTodos = async (): Promise<AxiosResponse<ApiDataType>> => {
    //console.log("firing");
    try{
        const todos: AxiosResponse<ApiDataType> = await axios.get(
            baseUrl + "/bnnmarketcall"
        )
        return todos
    }catch (error){
        throw new Error(error)
    }
}
