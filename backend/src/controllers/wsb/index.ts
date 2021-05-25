import { Response, Request } from "express"
import wsb from "../../models/wsb"
import { wsbType } from "../../types/wsb"

const getAllWsbFrequencyLists = async (req: Request, res: Response): Promise<void> => {
  try {
    const wsbFrequencyLists: wsbType[] = await wsb.find().exec()
    res.status(200).json({ wsbFrequencyLists })
  } catch (error) {
    res.status(400).json({error: error});
  }
}

const getWsbFrequencyListAtDate = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.params.date);

        let dateSplit = req.params.date.split("-");
        let year = Number(dateSplit[0]);
        let month = Number(dateSplit[1]) - 1;
        let day = Number(dateSplit[2]);
        console.log(`${year} ${month} ${day}`)
        let dateObj = new Date(year, month, day);
        console.log(dateObj);
        //split into parts and redo date conversion
        let foundCurrentEntry: any = await wsb.find({date: (dateObj)});
        
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

export { getAllWsbFrequencyLists, getWsbFrequencyListAtDate }
