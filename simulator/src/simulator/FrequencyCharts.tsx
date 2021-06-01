import React, { useEffect, useState } from "react";
import { getAllFrequencyLists } from "../API";
import AllFrequencyData from './AllFrequencyData';
import SingleTickerData from './SingleTickerData';

type Props = simulatorProps

const Article: React.FC<Props> = ({ }) => {

    const [frequencyLists, setFrequencyLists] = useState<Array<wsbFrequencyListItem>>();
    //new Array so the ts compiler knows its an array not an object so we can use [...spread]
    const [pageSelected, setPageSelected] = useState<string>("allData");

    useEffect(() => {

        async function loadFrequencyListsIntoState() {
            if (frequencyLists == undefined) {
                setFrequencyLists(JSON.parse(await getDataFromLocalStorage()));
            }
        }

        loadFrequencyListsIntoState();
    }, [])

    //should really error handle here for if api returns error
    async function getFrequencyChartDataFromServer() {
        //keep these comments
        console.log("pausing to get frequency data from server");
        let data = await getAllFrequencyLists();
        console.log("frequency data fetched");
        //console.log(data.data.wsbFrequencyLists);
        return data.data.wsbFrequencyLists;
    }

    function loadDataIntoLocalStorage(item: any) {
        localStorage.setItem('frequencyData', item);
    }

    async function getDataFromLocalStorage() {
        let data: any = localStorage.getItem('frequencyData');
        //console.log(data);
        if (data == null) {
            data = await getFrequencyChartDataFromServer();

            data = JSON.stringify(data);
            //console.log(JSON.stringify(data));
            loadDataIntoLocalStorage(data);
        }
        return data;
    }

    function deleteDataInLocalStorage() {
        localStorage.removeItem('frequencyData');
        setFrequencyLists(undefined);
    }

    return (
        <div className="FrequencyCharts">
            {   false &&
                <div className="loadDataForm">
                    <input type="button" onClick={loadDataIntoLocalStorage} value="Load data into local storage" />
                    <input type="button" onClick={deleteDataInLocalStorage} value="Delete data in local storage" />
                </div>
            }

            <div className="loadPageForm">
                <input type="button" onClick={() => setPageSelected("allData")} value="All Data" />
                <input type="button" onClick={() => setPageSelected("singleTicker")} value="Single Ticker" />
            </div>

            <div className="dataVisualizer">
                {pageSelected == "allData" ? (
                    <AllFrequencyData
                        frequencyLists={frequencyLists}
                    />
                ) : (
                    <SingleTickerData
                        frequencyLists={frequencyLists}
                    />
                )}
            </div>
        </div>

    )
}

export default Article;
