import { wsbType } from "../types/wsb"
import { model, Schema } from "mongoose"

const wsbSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    //should probably define this better, but its still a WIP
    freqList: {},

    date: {
      type: Date,
      required: true,
    },

  },
  //dont know if i need these timestamps
)

export default model<wsbType>("wsb", wsbSchema)