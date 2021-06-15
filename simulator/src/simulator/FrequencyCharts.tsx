import React, { useEffect, useState } from "react";
import { getAllFrequencyLists } from "../API";
import { getCryptoCurrencyAllFrequencyLists } from "../API";
import AllFrequencyData from './AllFrequencyData';
import SingleTickerData from './SingleTickerData';


const FrequencyCharts: React.FC<any> = () => {

    const [frequencyLists, setFrequencyLists] = useState<Array<wsbFrequencyListItem>>();
    const [cryptoFrequencyLists, setCryptoFrequencyLists] = useState<Array<cryptoCurrencyFrequencyListItem>>();
    const [pageSelected, setPageSelected] = useState<string>("allData");
    const [dataSourceSelected, setDataSourceSelected] = useState<string>('wsb');

    useEffect(() => {
        async function loadFrequencyListsIntoState() {
            if (frequencyLists === undefined) {
                setFrequencyLists(await getDataFromLocalStorage('frequencyData'));
            }
            if (cryptoFrequencyLists === undefined) {
                setCryptoFrequencyLists(await getDataFromLocalStorage('cryptoFrequencyData'));
            }
        }

        loadFrequencyListsIntoState();
    }, [frequencyLists, cryptoFrequencyLists])

    //should really error handle here for if api returns error
    async function getFrequencyChartDataFromServer(itemName: string) {
        if (itemName === 'frequencyData') {
            let data = await getAllFrequencyLists();
            console.log("frequency data fetched");
            return data.data.wsbFrequencyLists;

        }
        if (itemName === 'cryptoFrequencyData') {
            let data = await getCryptoCurrencyAllFrequencyLists();
            console.log("crypto frequency data fetched");
            return data.data.cryptocurrencyFrequencyLists;
        }
    }

    function loadDataIntoLocalStorage(itemName: string, item: any) {
        localStorage.setItem(itemName, JSON.stringify({ data: item, dateAdded: Date.now() }));
    }

    async function getDataFromLocalStorage(itemName: string) {
        let data: any = localStorage.getItem(itemName);
        if (data === null) {
            data = await getFrequencyChartDataFromServer(itemName);
            loadDataIntoLocalStorage(itemName, data);
        } else {
            //data = JSON.parse(data);
            let dateSaved = JSON.parse(data).dateAdded;

            //check if its old data
            if (new Date(Date.now()).getDay() != new Date(dateSaved).getDay()) {
                data = await getFrequencyChartDataFromServer(itemName);
                loadDataIntoLocalStorage(itemName, data);
            }else{
                data = JSON.parse(data);
            }
        }
        return data.data;
    }

    function deleteDataInLocalStorage() {
        localStorage.removeItem('frequencyData');
        localStorage.removeItem('cryptoFrequencyData');
        setFrequencyLists(undefined);
        setCryptoFrequencyLists(undefined);
    }

    return (
        <div className="FrequencyCharts">
            {   false &&
                <div className="loadDataForm">
                    <input type="button" onClick={deleteDataInLocalStorage} value="Delete data in local storage" />
                </div>
            }

            {frequencyLists === undefined || cryptoFrequencyLists === undefined &&
                <p>Data loading from server</p>
            }

            <div className="loadPageForm">
                <input type="button" className={"subButton" + (pageSelected === 'allData' ? ' navItemSelected' : '')} onClick={() => setPageSelected("allData")} value="All Data" />
                <input type="button" className={"subButton" + (pageSelected === 'singleTicker' ? ' navItemSelected' : '')} onClick={() => setPageSelected("singleTicker")} value="Single Ticker" />
            </div>

            <div className="loadPageForm">
                <input type="button" className={"subButton" + (dataSourceSelected === 'wsb' ? ' navItemSelected' : '')} onClick={() => setDataSourceSelected("wsb")} value="WSB" />
                <input type="button" className={"subButton" + (dataSourceSelected === 'crypto' ? ' navItemSelected' : '')} onClick={() => setDataSourceSelected("crypto")} value="Crypto Currency" />
            </div>

            <div className="dataVisualizer">
                {pageSelected === "allData" ? (
                    <AllFrequencyData
                        frequencyLists={dataSourceSelected === 'wsb' ? frequencyLists : cryptoFrequencyLists}
                    />
                ) : (
                    <SingleTickerData
                        frequencyLists={dataSourceSelected === 'wsb' ? frequencyLists : cryptoFrequencyLists}
                        dataSourceSelected={dataSourceSelected}
                    />
                )}
            </div>
        </div>

    )
}

export default FrequencyCharts;
