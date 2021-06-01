import React, { useEffect, useState } from "react";
import { getAllFrequencyLists } from "../API";
import Select from 'react-select';
import VerticalBar from "../charts/VerticalBar";
import LineChart from "../charts/LineChart";
import Chart from 'kaktana-react-lightweight-charts'
import { fetchCurrentPrice } from "../apiFunctions/yahooFinanceApiFunctions";
import { findAllByPlaceholderText } from "@testing-library/dom";
import { getCurrentData, getCurrentPrice, getHistoricalPrices } from '../API'
import { createModuleResolutionCache } from "typescript";

type Props = simulatorProps

const wsbSymbolsToFilter = ['is', 'at', 'are', 'open', 'for', 'lmao', 'now', 'on', 'bro', 'new', 'a', 'so', 'or', 'it', 'two', 'by', 'has', 'any', 'tell', 'out', 'hope', 'most', 'huge', 'pump', 'life', 'real', 'cash', 'apps', 'wow', 'very', 'link', 'find', 'best', 'big', 'low'];


const Article: React.FC<Props> = ( { } ) => {

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
    const [symbolsToFilterUpdate, setSymbolsToFilterUpdate] = useState<string>('');
    //new Array so the ts compiler knows its an array not an object so we can use [...spread]
    const [symbolsToFilter, setSymbolsToFilter] = useState<Array<String>> (new Array());
    const [pageSelected, setPageSelected] = useState<string>("allData");

    useEffect(() => {

        if(symbolsToFilter == undefined || symbolsToFilter.length < 1){
            let wsbWordsToFilterLocalStorage:any = localStorage.getItem('wsbWordsToFilter');
            wsbWordsToFilterLocalStorage = JSON.parse(wsbWordsToFilterLocalStorage);
            if(wsbWordsToFilterLocalStorage == null){
                console.log("resetting symbols to filter");
                setSymbolsToFilter(wsbSymbolsToFilter);
            }else{
                console.log("setting symbols to filter from localStorage");
                setSymbolsToFilter(wsbWordsToFilterLocalStorage);
            }
            
        }
    
        async function loadFrequencyListsIntoState() {
            if(frequencyLists == undefined){

                setFrequencyLists(JSON.parse(await getDataFromLocalStorage()));
            }
          }

          loadFrequencyListsIntoState();
    }, [symbolsToFilter])


    const fetchHistoricalPrices = (_startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
        getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, _ticker, _frequency)
        .then(({ data: { historicalPrices } }: any) => setHistoricalPrices(historicalPrices))
        .catch((err: Error) => console.log(err))
    }

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
        //console.log(data);
        if(data == null){
            data = await getFrequencyChartDataFromServer();
            
            data = JSON.stringify(data);
            //console.log(JSON.stringify(data));
            loadDataIntoLocalStorage(data);
        }
        return data;
    }

    function deleteDataInLocalStorage(){
        localStorage.removeItem('frequencyData');
        setFrequencyLists(undefined);
    }
    
    function getFrequenclyListsDatesArray(){
        let datesToPass:any = [];
        if(frequencyLists != undefined){
            let size = frequencyLists.length;
            for(let i = 0; i < size; i++){
                datesToPass.push({value: frequencyLists[i].date, label: frequencyLists[i].date});
            }
        }

        return datesToPass.reverse();
    }


    function singleDayFrequencyChartClicked(){
        if(selectedOneDay != null && frequencyLists != undefined){
            setSingleDayFrequencyChartActive(true);
            
            let size = frequencyLists.length;
            for(let i = 0; i < size; i++){
                if(frequencyLists[i].date == selectedOneDay.value){
                    setOneDayFrequencyChartData(frequencyLists[i]);
                }
            }
        }else{
            alert("Must select a date from the dropdown");
        }
    }

    function sortSubtract(a:any , b: any) {
        if(!sortDirection){
            return b.freq - a.freq;
        }else{
            return a.freq - b.freq;
        }
    }

    function getSingleDayFrequencyDataFixed(){
        //want to skip entries with frequency < n
        let tickerLabels = [];
        let tickerCount = [];
        let backgroundColor = [];
        let borderColor = [];
        //console.log("here");
        //console.log(oneDayFrequencyChartData);
        //console.log(oneDayFrequencyChartData.freqList);
        
        let listToSort = [];

        for (let [key, value] of Object.entries(oneDayFrequencyChartData.freqList)) {
            listToSort.push({ticker: key, freq: value});   
        }

        //sort listToSort
        
        listToSort.sort(sortSubtract);

        let sizeOfList = listToSort.length;
        for(let i = 0; i < sizeOfList; i++){
            //console.log(`key: ${key} value: ${value}`);
            //can filter words here
            if(!symbolsToFilter.includes(listToSort[i].ticker)){
                if(Number(listToSort[i].freq) > Number(minFrequencyToDisplay)){
                    tickerLabels.push(listToSort[i].ticker);
                    tickerCount.push(listToSort[i].freq);
                    var o = Math.round, r = Math.random, s = 255;
                    let barBorder = 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 0.2 + ')';
                    let barColor = 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 1 + ')'
                    backgroundColor.push(barColor);
                    borderColor.push(barBorder);
                }
            }
        }

        
        const finalData = {
            labels: tickerLabels,
            datasets: [
              {
                label: 'Frequecy of symbol usage',
                data: tickerCount,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
              },
            ],
          };

          return finalData;

    }

    function getFrequencyOverTimeFixed(){

        let dateLabels = [];
        let freqValues =[];
        let size = frequencyOverTime.length;

        for(let i = 0; i < size; i++){
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

    function frequencyOverTimeClicked(){

        setFixedHistoricalPrices(undefined);
        setFixedVolumeData(undefined);
        setHistoricalPrices(undefined);

        if(selectedTicker == undefined){
            alert("must enter a ticker");
            return;
        }
        //figure out what to do

        let selectedTickerData = [];
        //store the date and freq of the selectedTicker in a list
        if(frequencyLists != undefined){
            let size = frequencyLists.length;
            for(let i = 0; i < size; i++){
                if(frequencyLists[i].freqList != undefined){
                    let currentFreqList: any = frequencyLists[i].freqList;
                    let currentFreq:any = currentFreqList[selectedTicker];
                    if(currentFreq != undefined){
                        selectedTickerData.push({date: frequencyLists[i].date, freq: currentFreq});
                    }
                }
            }
        }

        selectedTickerData.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            if(a.date > b.date){
                return 1
            }else if(a.date == b.date){
                return 0;
            }else{
                return -1;
            }
        });
        
        //sort the list by date

        //then create the config file

        setFrequencyOverTime(selectedTickerData);

        //console.log(new Date(selectedTickerData[0].date));
        let startDate = new Date(selectedTickerData[0].date);
        let endDate = new Date(selectedTickerData[selectedTickerData.length-1].date);

        //first date, last date
        fetchHistoricalPrices(`${startDate.getMonth()}`, `${startDate.getDate()}`, `${startDate.getFullYear()}`, `${endDate.getMonth()}`, `${endDate.getDate()}`, `${endDate.getFullYear()}`, selectedTicker, "1d");

        
    }

    function printFilteredWords(){
        if(symbolsToFilter != undefined){
            let size = symbolsToFilter.length;

            let string = "";
            for(let i = 0; i < size; i++){
                string += symbolsToFilter[i] + ", "
            }
            return string;
        }else{
            return "symbol list not loaded";
        }

    }

    function setValue(e: any){
        setMinFrequencyToDisplay(e.target.value);
    }


    function changeSortDirection(){
        setSortDirection(!sortDirection);
    }

    function fixHistoricalPrices(){

        console.log("fixing historical prices");
        
        let tempHistoricalPrices: Array<areaSeriesType> = [];
        //so the dates are inthe wrong order, sorting it is probably inneficient but we can just reverse it since we are already iterating over it.
        //can probably do this counter better, dont think I need a var but its just quick and easy
        let counter = 0;
        for(let i = historicalPrices.length - 1; i > 0; i--){
            //for area series graph we only want the values time and value inside our object
            //the open and close are good for candle graphs. 
            let object = {time: historicalPrices[i].date, value: Number(historicalPrices[i].close)}
            tempHistoricalPrices[counter] = object;
            counter++;
        }
        setFixedHistoricalPrices(tempHistoricalPrices);  
    }

    function fixVolumeData(){

        let tempVolumeData: Array<areaSeriesType> = [];

        console.log("here");
        let counter = 0;
        let size = historicalPrices.length;
        //console.log(size);
        for(let i = size - 1; i > 0; i--){
            //console.log(historicalPrices[i]);
            let object = {time: historicalPrices[i].date, value: Number(historicalPrices[i].volume)}
            //console.log(object);
            tempVolumeData[counter] = object;
            counter++;
        }
        console.log(tempVolumeData);
        setFixedVolumeData(tempVolumeData);
    }

    function renderStockChart(){


        let options:object = {
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
        let areaSeries:any = [{
            data: fixedHistoricalPrices
        }]

        return(
            <div className="simulationChart">
                <p>Chart for {selectedTicker} Date Range: {new Date(fixedHistoricalPrices[0].time * 1000).toDateString()} to {new Date(fixedHistoricalPrices[fixedHistoricalPrices.length - 1].time * 1000).toDateString()}</p>
                <Chart options={options} areaSeries={areaSeries} autoWidth height={500} />
            </div>
        )

    }

    function renderVolumeChart(){
        let options:object = {
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
        let areaSeries:any = [{
            data: fixedVolumeData
        }]

        return(
            <div className="simulationChart">
                <p>Volume chart for {selectedTicker} Date Range: {new Date(fixedVolumeData[0].time * 1000).toDateString()} to {new Date(fixedVolumeData[fixedVolumeData.length - 1].time * 1000).toDateString()}</p>
                <Chart options={options} areaSeries={areaSeries} autoWidth height={500} />
            </div>
        )
    }
    
    if(historicalPrices != undefined && fixedHistoricalPrices == undefined){
        fixHistoricalPrices();
    }

    if(historicalPrices != undefined && fixedVolumeData == undefined){
        fixVolumeData();
    }

    function updateSymbolsToFilterUpdate(event: any){
        setSymbolsToFilterUpdate(event.target.value)
    }

    function addSymbolToFilter(){
        if(symbolsToFilter != undefined){

            let localStorageUpdate:any = [...symbolsToFilter];
            localStorageUpdate.push(symbolsToFilterUpdate);
            console.log("adding new symbol to filter");
            setSymbolsToFilter((symbolsToFilter) => [...symbolsToFilter, symbolsToFilterUpdate]);
            setSymbolsToFilterUpdate("");
            
            localStorage.setItem("wsbWordsToFilter", JSON.stringify(localStorageUpdate));
        }else{
            console.log("symbols to filter is undefined");
        }
        
    }

    function removeSymbolFromFilter(){
        setSymbolsToFilter(symbolsToFilter.filter(item => item !== symbolsToFilterUpdate));
        let localStorageUpdate:any =  symbolsToFilter.filter(item => item !== symbolsToFilterUpdate)
        localStorage.setItem("wsbWordsToFilter", JSON.stringify(localStorageUpdate));

        setSymbolsToFilterUpdate("");

    }

    return (
        <div className="FrequencyCharts">
            <div className="loadDataForm">
                <input type="button" onClick={loadDataIntoLocalStorage} value="Load data into local storage"/>
                <input type="button" onClick={deleteDataInLocalStorage} value="Delete data in local storage"/>
            </div>
            <div className="loadPageForm">
                <input type="button" onClick={() => setPageSelected("allData")} value="All Data"/>
                <input type="button" onClick={() => setPageSelected("singleTicker")} value="Single Ticker"/>
            </div>
            
            <div className="dataVisualizer">
                <div className="singleDayFrequency">
                    <p>View a frequency chart for a single day</p>
                    <Select
                        defaultValue={selectedOneDay}
                        onChange={setSelectedOneDay}
                        options={getFrequenclyListsDatesArray()}
                    />
                    <input type="button" onClick={singleDayFrequencyChartClicked} value="View Frequency Chart"/>
                    
                    <p>Filtering Words: {printFilteredWords()}</p>
                    <input type="text" value={symbolsToFilterUpdate} onChange={updateSymbolsToFilterUpdate} />
                    <input type="button" onClick={addSymbolToFilter} value="Add"/>
                    <input type="button" onClick={removeSymbolFromFilter} value="Remove"></input>

                    {singleDayFrequencyChartActive && selectedOneDay != null && oneDayFrequencyChartData != undefined &&
                        <>
                            <p>Chart is active</p>
                            <input type="text" value={minFrequencyToDisplay} onChange={setValue}/>
                            <input type="button" value="Change Sort Direction" onClick={changeSortDirection}/>
                            <VerticalBar data={getSingleDayFrequencyDataFixed} options={{}} header={`Frequency Chart for ${selectedOneDay.value}`}/>
                        </>
                    }
                </div>
                <div className="tickerFreqOverTime">
                    <p>View the frequency of a ticker over time</p>
                    <input type="text" value={selectedTicker} onChange={e => setSelectedTicker(e.target.value)}/>
                    <input type="button" onClick={frequencyOverTimeClicked} value="View Ticker Frequency Over Time"/>
                    
                    {frequencyOverTime != undefined &&
                        <>
                            <div className="charts">
                                <div className="chart-container">
                                    <LineChart data={getFrequencyOverTimeFixed} options={{}}/>
                                </div>
                                
                                {fixedHistoricalPrices &&
                                    renderStockChart()
                                }

                                {fixedVolumeData &&
                                    renderVolumeChart()
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
        
    )
}


export default Article;
