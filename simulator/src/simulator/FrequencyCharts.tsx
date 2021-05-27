import React, { useEffect, useState } from "react";
import { getAllFrequencyLists } from "../API";
type Props = simulatorProps

const Article: React.FC<Props> = ( { } ) => {

    const [frequencyLists, setFrequencyLists] = useState<Array<wsbFrequencyListItem>>();

    useEffect(() => {
    
        async function loadFrequencyListsIntoState() {
            if(frequencyLists == undefined){
                let localStorageData = await getDataFromLocalStorage();
                let parsedData = JSON.parse(localStorageData);
                setFrequencyLists(parsedData);
            }
          }

          loadFrequencyListsIntoState();
    }, [])

    //should really error handle here for if api returns error
    async function getFrequencyChartDataFromServer(){
        
        //keep these comments
        console.log("pausing to get frequency data from server");
        let data = await getAllFrequencyLists();
        console.log("frequency data fetched");
        //console.log(data.data.wsbFrequencyLists);
        return data.data.wsbFrequencyLists;
    }

    function loadDataIntoLocalStorage(item: any){
        localStorage.setItem('frequencyData', item);
    }

    async function getDataFromLocalStorage(){
        let data:any = localStorage.getItem('frequencyData'); 
        if(data == null){
            data = await getFrequencyChartDataFromServer();
            console.log(data);
            loadDataIntoLocalStorage(JSON.stringify(data));
        }
        return data;
    }

    function deleteDataInLocalStorage(){
        localStorage.removeItem('frequencyData');
    }

    return (
        <div className="FrequencyCharts">
            <div className="loadDataForm">
                <input type="button" onClick={loadDataIntoLocalStorage} value="Load data into local storage"/>
                <input type="button" onClick={deleteDataInLocalStorage} value="Delete data in local storage"/>
            </div>
        </div>
    )
}


export default Article;
