import React, { useEffect, useState } from "react";
import { getAllFrequencyLists } from "../API";
import Chart from 'kaktana-react-lightweight-charts'
import { fetchCurrentPrice } from "../apiFunctions/yahooFinanceApiFunctions";
import { findAllByPlaceholderText } from "@testing-library/dom";
import { getCurrentData, getCurrentPrice, getHistoricalPrices } from '../API'
import { createModuleResolutionCache } from "typescript";
import AllFrequencyData from './AllFrequencyData';
import SingleTickerData from './SingleTickerData';

type Props = simulatorProps



const Article: React.FC<Props> = ({ }) => {

    const [frequencyLists, setFrequencyLists] = useState<Array<wsbFrequencyListItem>>();
    const [selectedOneDay, setSelectedOneDay] = useState<any>(null);
    const [singleDayFrequencyChartActive, setSingleDayFrequencyChartActive] = useState<boolean>(false);
    const [oneDayFrequencyChartData, setOneDayFrequencyChartData] = useState<any>();
    const [minFrequencyToDisplay, setMinFrequencyToDisplay] = useState<string>('50');
    const [sortDirection, setSortDirection] = useState<boolean>(false);
    const [selectedTicker, setSelectedTicker] = useState<any>("");
    const [frequencyOverTime, setFrequencyOverTime] = useState<any>(null);
    const [historicalPrices, setHistoricalPrices] = useState<any>(null);
    const [fixedHistoricalPrices, setFixedHistoricalPrices] = useState<any>(null);
    const [fixedVolumeData, setFixedVolumeData] = useState<any>(null);
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


    const fetchHistoricalPrices = (_startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
        getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, _ticker, _frequency)
            .then(({ data: { historicalPrices } }: any) => setHistoricalPrices(historicalPrices))
            .catch((err: Error) => console.log(err))
    }

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




    function singleDayFrequencyChartClicked() {
        if (selectedOneDay != null && frequencyLists != undefined) {
            setSingleDayFrequencyChartActive(true);

            let size = frequencyLists.length;
            for (let i = 0; i < size; i++) {
                if (frequencyLists[i].date == selectedOneDay.value) {
                    setOneDayFrequencyChartData(frequencyLists[i]);
                }
            }
        } else {
            alert("Must select a date from the dropdown");
        }
    }

    function sortSubtract(a: any, b: any) {
        if (!sortDirection) {
            return b.freq - a.freq;
        } else {
            return a.freq - b.freq;
        }
    }



    function getFrequencyOverTimeFixed() {

        let dateLabels = [];
        let freqValues = [];
        let size = frequencyOverTime.length;

        for (let i = 0; i < size; i++) {
            dateLabels.push(frequencyOverTime[i].date);
            freqValues.push(frequencyOverTime[i].freq);
        }

        const finalData = {
            labels: dateLabels,
            datasets: [
                {
                    label: `Frequency of ${selectedTicker} over time`,
                    data: freqValues,
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                },
            ],
        };

        return finalData;
    }

    function frequencyOverTimeClicked() {

        setFixedHistoricalPrices(undefined);
        setFixedVolumeData(undefined);
        setHistoricalPrices(undefined);

        if (selectedTicker == undefined) {
            alert("must enter a ticker");
            return;
        }
        //figure out what to do

        let selectedTickerData = [];
        //store the date and freq of the selectedTicker in a list
        if (frequencyLists != undefined) {
            let size = frequencyLists.length;
            for (let i = 0; i < size; i++) {
                if (frequencyLists[i].freqList != undefined) {
                    let currentFreqList: any = frequencyLists[i].freqList;
                    let currentFreq: any = currentFreqList[selectedTicker];
                    if (currentFreq != undefined) {
                        selectedTickerData.push({ date: frequencyLists[i].date, freq: currentFreq });
                    }
                }
            }
        }

        selectedTickerData.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            if (a.date > b.date) {
                return 1
            } else if (a.date == b.date) {
                return 0;
            } else {
                return -1;
            }
        });

        //sort the list by date

        //then create the config file

        setFrequencyOverTime(selectedTickerData);

        //console.log(new Date(selectedTickerData[0].date));
        let startDate = new Date(selectedTickerData[0].date);
        let endDate = new Date(selectedTickerData[selectedTickerData.length - 1].date);

        //first date, last date
        fetchHistoricalPrices(`${startDate.getMonth()}`, `${startDate.getDate()}`, `${startDate.getFullYear()}`, `${endDate.getMonth()}`, `${endDate.getDate()}`, `${endDate.getFullYear()}`, selectedTicker, "1d");


    }


    function setValue(e: any) {
        setMinFrequencyToDisplay(e.target.value);
    }


    function changeSortDirection() {
        setSortDirection(!sortDirection);
    }

    function fixHistoricalPrices() {

        console.log("fixing historical prices");

        let tempHistoricalPrices: Array<areaSeriesType> = [];
        //so the dates are inthe wrong order, sorting it is probably inneficient but we can just reverse it since we are already iterating over it.
        //can probably do this counter better, dont think I need a var but its just quick and easy
        let counter = 0;
        for (let i = historicalPrices.length - 1; i > 0; i--) {
            //for area series graph we only want the values time and value inside our object
            //the open and close are good for candle graphs. 
            let object = { time: historicalPrices[i].date, value: Number(historicalPrices[i].close) }
            tempHistoricalPrices[counter] = object;
            counter++;
        }
        setFixedHistoricalPrices(tempHistoricalPrices);
    }

    function fixVolumeData() {

        let tempVolumeData: Array<areaSeriesType> = [];

        console.log("here");
        let counter = 0;
        let size = historicalPrices.length;
        //console.log(size);
        for (let i = size - 1; i > 0; i--) {
            //console.log(historicalPrices[i]);
            let object = { time: historicalPrices[i].date, value: Number(historicalPrices[i].volume) }
            //console.log(object);
            tempVolumeData[counter] = object;
            counter++;
        }
        console.log(tempVolumeData);
        setFixedVolumeData(tempVolumeData);
    }

    function renderStockChart() {


        let options: object = {
            topColor: 'rgba(21, 146, 230, 0.4)',
            bottomColor: 'rgba(21, 146, 230, 0)',
            lineColor: 'rgba(21, 146, 230, 1)',
            lineStyle: 0,
            lineWidth: 3,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 3,
            crosshairMarkerBorderColor: 'rgb(255, 255, 255, 1)',
            crosshairMarkerBackgroundColor: 'rgb(34, 150, 243, 1)',
        }
        let areaSeries: any = [{
            data: fixedHistoricalPrices
        }]

        return (
            <div className="simulationChart">
                <p>Chart for {selectedTicker} Date Range: {new Date(fixedHistoricalPrices[0].time * 1000).toDateString()} to {new Date(fixedHistoricalPrices[fixedHistoricalPrices.length - 1].time * 1000).toDateString()}</p>
                <Chart options={options} areaSeries={areaSeries} autoWidth height={500} />
            </div>
        )

    }

    function renderVolumeChart() {
        let options: object = {
            topColor: 'rgba(21, 146, 230, 0.4)',
            bottomColor: 'rgba(21, 146, 230, 0)',
            lineColor: 'rgba(21, 146, 230, 1)',
            lineStyle: 0,
            lineWidth: 3,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 3,
            crosshairMarkerBorderColor: 'rgb(255, 255, 255, 1)',
            crosshairMarkerBackgroundColor: 'rgb(34, 150, 243, 1)',
        }
        let areaSeries: any = [{
            data: fixedVolumeData
        }]

        return (
            <div className="simulationChart">
                <p>Volume chart for {selectedTicker} Date Range: {new Date(fixedVolumeData[0].time * 1000).toDateString()} to {new Date(fixedVolumeData[fixedVolumeData.length - 1].time * 1000).toDateString()}</p>
                <Chart options={options} areaSeries={areaSeries} autoWidth height={500} />
            </div>
        )
    }

    if (historicalPrices != undefined && fixedHistoricalPrices == undefined) {
        fixHistoricalPrices();
    }

    if (historicalPrices != undefined && fixedVolumeData == undefined) {
        fixVolumeData();
    }

    return (
        <div className="FrequencyCharts">
            <div className="loadDataForm">
                <input type="button" onClick={loadDataIntoLocalStorage} value="Load data into local storage" />
                <input type="button" onClick={deleteDataInLocalStorage} value="Delete data in local storage" />
            </div>
            <div className="loadPageForm">
                <input type="button" onClick={() => setPageSelected("allData")} value="All Data" />
                <input type="button" onClick={() => setPageSelected("singleTicker")} value="Single Ticker" />
            </div>

            <div className="dataVisualizer">
                {pageSelected == "allData" ? (
                    <AllFrequencyData
                        oneDayFrequencyChartData={oneDayFrequencyChartData}
                        sortSubtract={sortSubtract}
                        minFrequencyToDisplay={minFrequencyToDisplay}
                        selectedOneDay={selectedOneDay}
                        frequencyLists={frequencyLists}
                        setSelectedOneDay={setSelectedOneDay}
                        singleDayFrequencyChartClicked={singleDayFrequencyChartClicked}
                        singleDayFrequencyChartActive={singleDayFrequencyChartActive}
                        setValue={setValue}
                        changeSortDirection={changeSortDirection}
                    />
                ) : (
                    <SingleTickerData
                        selectedTicker={selectedTicker}
                        setSelectedTicker={setSelectedTicker}
                        frequencyOverTimeClicked={frequencyOverTimeClicked}
                        frequencyOverTime={frequencyOverTime}
                        getFrequencyOverTimeFixed={getFrequencyOverTimeFixed}
                        fixedHistoricalPrices={fixedHistoricalPrices}
                        renderStockChart={renderStockChart}
                        renderVolumeChart={renderVolumeChart}
                        fixedVolumeData={fixedVolumeData}
                    />
                )}
            </div>
        </div>

    )
}


export default Article;
