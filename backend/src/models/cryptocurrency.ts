import { cryptocurrencyType } from "../types/cryptocurrency"
import { model, Schema } from "mongoose"

const cryptocurrencySchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    freqList: {},

    date: {
      type: Date,
      required: true,
    },

    numComments: {
        type: Number,
        required: true,
    },

    threadId: {
        type: String,
        required: true,
    }

  },
)

export default model<cryptocurrencyType>("cryptocurrency", cryptocurrencySchema)