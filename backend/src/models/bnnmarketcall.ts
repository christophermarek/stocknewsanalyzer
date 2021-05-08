import { bnnmarketcall, Pick } from "../types/bnnmarketcall"
import { model, Schema } from "mongoose"

const bnnmarketcallSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    month: {
      type: String,
      required: true,
    },

    day: {
      type: String,
      required: true,
    },

    guest: {
      type: String,
      required: true,
    },
    
    picks: {
      type: [{_id: String, name: String, ticker: String}],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },
  },
  //dont know if i need these timestamps
  { timestamps: true }
)

export default model<bnnmarketcall>("Bnnmarketcall", bnnmarketcallSchema)