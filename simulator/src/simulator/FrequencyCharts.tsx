import React, { useEffect, useState } from "react";

type Props = simulatorProps

const Article: React.FC<Props> = ( { } ) => {

    const [isDataInLocalStorage, setDataInLocalStorage] = useState<string>('false');
    const [dateDataInLocalStorage, setDateDataInLocalStorage] = useState<String>('');

    useEffect(() => {
        if(isDataInLocalStorage == 'false'){
            let localStorageItem:any = getDataFromLocalStorage();
            if(localStorageItem == null){
                getFrequencyChartDataFromServer();
            }else{
                setDataInLocalStorage(localStorageItem.data);
                setDataInLocalStorage(localStorage.date)
            }
        }
    }, [])

    function getFrequencyChartDataFromServer(){
        
        

        let date = "fill in";
        setDataInLocalStorage('true');
        setDateDataInLocalStorage(date);
    }

    function loadDataIntoLocalStorage(item: any){
        localStorage.setItem('frequencyData', item);
    }

    function getDataFromLocalStorage(){
       return localStorage.getItem('frequencyData'); 
    }

    function deleteDataInLocalStorage(){
        localStorage.removeItem('frequencyData');
    }

    return (
        <div className="FrequencyCharts">
            <div className="loadDataForm">
                <input type="button" onClick={loadDataIntoLocalStorage} value="Load data into local storage"/>
                <input type="button" onClick={deleteDataInLocalStorage} value="Delete data in local storage"/>
                <p>Data in local storage: {isDataInLocalStorage}  Last pulled: dateDataInLocalStorage</p>
            </div>
        </div>
    )
}


export default Article;
