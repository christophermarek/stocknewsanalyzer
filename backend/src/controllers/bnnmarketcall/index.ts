import { Response, Request } from "express"
import { bnnmarketcallType } from "../../types/bnnmarketcall"
import bnnmarketcall from "../../models/bnnmarketcall"

const getbnnmarketcallData = async (req: Request, res: Response): Promise<void> => {
  try {
    const bnnmarketcallData: bnnmarketcallType[] = await bnnmarketcall.find().exec()
    res.status(200).json({ bnnmarketcallData })
  } catch (error) {
    throw error
  }
}

export {getbnnmarketcallData}