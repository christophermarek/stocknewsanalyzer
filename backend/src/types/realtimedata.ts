import { Document } from "mongoose"

export interface realtimedataType extends Document {
    _id: string
    frequencyList: object
    sentimentList: object
    createdAt: any
    updatedAt: any
}