
import { Response, Request } from "express"
import { getCurrentData, getCurrentPrice, getHistoricalPrices } from "./yahoo-stock-prices-fetch"

const getCurrentDataController = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentData: any = await getCurrentData(req.params.id);
    res.status(200).json({ currentData });
  } catch (error) {
    res.status(400).json({error: "Invalid ticker"});
  }
}

const getCurrentPriceController = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentPrice: any = await getCurrentPrice(req.params.id, false);
    res.status(200).json({ currentPrice });
  } catch (error) {
    res.status(400).json({error: "Invalid ticker"});
  }
}

const getHistoricalPricesController = async (req: Request, res: Response): Promise<void> => {
  try {
    /*
    startMonth: any,
    startDay: any,
    startYear: any,
    endMonth: any,
    endDay: any,
    endYear: any,
    ticker: any,
    frequency: any,
    callback: any,
*/
    const historicalPrices: any = await getHistoricalPrices(req.params.startMonth, req.params.startDay, req.params.startYear, req.params.endMonth, req.params.endDay, req.params.endYear, req.params.ticker, req.params.frequency, false);
    res.status(200).json({ historicalPrices: historicalPrices });
  } catch (error) {
    res.status(400).json({error: "Invalid request"});
  }
}



export { getCurrentDataController, getCurrentPriceController, getHistoricalPricesController }
