import { realtimedataType } from "../types/realtimedata";
import { model, Schema } from "mongoose";

const realtimedataSchema: Schema = new Schema(
  {
    _id: { type: String, required: true },
    frequencyList: {},
    sentimentList: {},
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
)

const realtimeCrypto = model<realtimedataType>("cryptorealtime", realtimedataSchema);
const realtimeWsb = model<realtimedataType>("wsbrealtime", realtimedataSchema)

export { realtimeCrypto, realtimeWsb }

