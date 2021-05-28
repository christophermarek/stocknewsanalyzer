import React, { useEffect, useState } from "react";
import { getAllFrequencyLists } from "../API";
import Select from 'react-select';
import VerticalBar from "../charts/VerticalBar";

type Props = simulatorProps

const wsbSymbolsToFilter = ['is', 'at', 'are', 'open', 'for', 'lmao', 'now', 'on', 'bro', 'new', 'a', 'so', 'or', 'it', 'two', 'by', 'has', 'any', 'tell', 'out', 'hope', 'most', 'huge', 'pump', 'life', 'real', 'cash', 'apps', 'wow', 'very', 'link', 'find', 'best', 'big', 'low'];

const Article: React.FC<Props> = ( { } ) => {

    const [frequencyLists, setFrequencyLists] = useState<Array<wsbFrequencyListItem>>();
    const [selectedOneDay, setSelectedOneDay] = useState<any>(null);
    const [singleDayFrequencyChartActive, setSingleDayFrequencyChartActive] = useState<boolean>(false);
    const [oneDayFrequencyChartData, setOneDayFrequencyChartData] = useState<any>();
    const [minFrequencyToDisplay, setMinFrequencyToDisplay] = useState<string>('50');
    const [sortDirection, setSortDirection] = useState<boolean>(false);
    
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

        function sortSubtract(a:any , b: any) {
            if(!sortDirection){
                return b.freq - a.freq;
            }else{
                return a.freq - b.freq;
            }
        }
        
        listToSort.sort(sortSubtract);

        let sizeOfList = listToSort.length;
        for(let i = 0; i < sizeOfList; i++){
            //console.log(`key: ${key} value: ${value}`);
            //can filter words here
            if(!wsbSymbolsToFilter.includes(listToSort[i].ticker)){
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

    function printFilteredWords(){
        
        let size = wsbSymbolsToFilter.length;

        let string = "";
        for(let i = 0; i < size; i++){
            string += wsbSymbolsToFilter[i] + ", "
        }
        return string;
    }

    function setValue(e: any){
        setMinFrequencyToDisplay(e.target.value);
    }

    function changeSortDirection(){
        setSortDirection(!sortDirection);
    }

    return (
        <div className="FrequencyCharts">
            <div className="loadDataForm">
                <input type="button" onClick={loadDataIntoLocalStorage} value="Load data into local storage"/>
                <input type="button" onClick={deleteDataInLocalStorage} value="Delete data in local storage"/>
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

                    {singleDayFrequencyChartActive && selectedOneDay != null && oneDayFrequencyChartData != undefined &&
                        <>
                            <p>Chart is active</p>
                            <p>Filtering Words: {printFilteredWords()}</p>
                            <input type="text" value={minFrequencyToDisplay} onChange={setValue}/>
                            <input type="button" value="Change Sort Direction" onClick={changeSortDirection}/>
                            <VerticalBar data={getSingleDayFrequencyDataFixed()} options={{}} header={`Frequency Chart for ${selectedOneDay.value}`}/>
                        </>
                    }
                </div>
            </div>
        </div>
        
    )
}


export default Article;
