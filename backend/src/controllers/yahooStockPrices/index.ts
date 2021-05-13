
import { Response, Request } from "express"
import { getCurrentData, getCurrentPrice, getHistoricalPrices } from "./yahoo-stock-prices-fetch"

const getCurrentPriceController = async (req: Request, res: Response): Promise<void> => {
  console.log("hit");
  try {
    const price = await getCurrentData('AAPL');
    //console.log(price);
    res.status(200).json({ price })

  } catch (error) {
    throw error
  }
}

export {getCurrentPriceController}
