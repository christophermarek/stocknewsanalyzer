
import { Date, Document } from "mongoose"


export interface wsbType extends Document {
    _id: string
    freqList: object
    date: any
}


