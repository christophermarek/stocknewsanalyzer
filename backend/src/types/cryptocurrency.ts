import { Date, Document } from "mongoose"

export interface cryptocurrencyType extends Document {
    _id: string
    freqList: object
    date: any
    numComments: any
    threadId: any
}