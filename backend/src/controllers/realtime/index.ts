import { Response, Request } from "express"
import { realtimeCrypto, realtimeWsb } from "../../models/realtimedata"
import { realtimedataType } from "../../types/realtimedata"

const getAllRealTimeCryptoData = async (req: Request, res: Response): Promise<void> => {
    try {
        const realtimeList: realtimedataType[] = await realtimeCrypto.find().exec()
        res.status(200).json({ realtimeList })
    } catch (error) {
        res.status(400).json({ error: error });
    }
}

const getAllRealTimeWsb = async (req: Request, res: Response): Promise<void> => {
    try {
        const realtimeList: realtimedataType[] = await realtimeWsb.find().exec()
        res.status(200).json({ realtimeList })
    } catch (error) {
        res.status(400).json({ error: error });
    }
}

export { getAllRealTimeCryptoData, getAllRealTimeWsb }
