
import { Document } from "mongoose"


export interface bnnmarketcallType extends Document {
    _id: string
    month: string
    day: string
    guest: string
    picks: pick[]
    date: Date
}

//I dont reference this in the bnnmarketcall schema
interface pick {
    _id: string
    name: string
    ticker: string
}

export type Pick = pick;
