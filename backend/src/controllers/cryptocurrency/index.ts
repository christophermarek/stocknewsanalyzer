import { Response, Request } from "express"
import cryptocurrency from "../../models/cryptocurrency"
import { cryptocurrencyType } from "../../types/cryptocurrency"

const getAllCryptoCurrencyFrequencyLists = async (req: Request, res: Response): Promise<void> => {
  try {
    const cryptocurrencyFrequencyLists: cryptocurrencyType[] = await cryptocurrency.find().exec()
    res.status(200).json({ cryptocurrencyFrequencyLists })
  } catch (error) {
    res.status(400).json({error: error});
  }
}

const getCryptoCurrencyFrequencyListAtDate = async (req: Request, res: Response): Promise<void> => {
    try {

        let dateSplit = req.params.date.split("-");
        let year = Number(dateSplit[0]);
        let month = Number(dateSplit[1]) - 1;
        let day = Number(dateSplit[2]);
        let dateObj = new Date(year, month, day);
        let foundCurrentEntry: any = await cryptocurrency.find({date: (dateObj)});
        
        if(foundCurrentEntry.length > 1){
          for(let i = 0; i < foundCurrentEntry.length; i++){
            //there are a few that exists, they need to be cleaned up
            console.log(`Db has duplicates, here are ids of all duplicates ${foundCurrentEntry[i]._id}`);
          }
          let intitialEntry = foundCurrentEntry[0];
          res.status(200).json({ intitialEntry });

        }else{
          res.status(200).json({ foundCurrentEntry });
        }
        
    } catch (error) {
      res.status(400).json({error: "Invalid Date"});
    }
}

export { getAllCryptoCurrencyFrequencyLists, getCryptoCurrencyFrequencyListAtDate }
