import React, { useEffect, useState } from "react";
import Select from 'react-select';
import VerticalBar from "../charts/VerticalBar";

const wsbSymbolsToFilter = ['is', 'at', 'are', 'open', 'for', 'lmao', 'now', 'on', 'bro', 'new', 'a', 'so', 'or', 'it', 'two', 'by', 'has', 'any', 'tell', 'out', 'hope', 'most', 'huge', 'pump', 'life', 'real', 'cash', 'apps', 'wow', 'very', 'link', 'find', 'best', 'big', 'low'];

type Props = allFrequencyDataProps;

const AllFrequencyData: React.FC<Props> = ({ frequencyLists }) => {

    const [symbolsToFilter, setSymbolsToFilter] = useState<Array<String>>(new Array());
    const [symbolsToFilterUpdate, setSymbolsToFilterUpdate] = useState<string>('');
    const [oneDayFrequencyChartData, setOneDayFrequencyChartData] = useState<any>();
    const [singleDayFrequencyChartActive, setSingleDayFrequencyChartActive] = useState<boolean>(false);
    const [sortDirection, setSortDirection] = useState<boolean>(false);
    const [minFrequencyToDisplay, setMinFrequencyToDisplay] = useState<string>('50');
    const [selectedOneDay, setSelectedOneDay] = useState<any>(null);

    useEffect(() => {

        if (symbolsToFilter == undefined || symbolsToFilter.length < 1) {
            let wsbWordsToFilterLocalStorage: any = localStorage.getItem('wsbWordsToFilter');
            wsbWordsToFilterLocalStorage = JSON.parse(wsbWordsToFilterLocalStorage);
            if (wsbWordsToFilterLocalStorage == null) {
                console.log("resetting symbols to filter");
                setSymbolsToFilter(wsbSymbolsToFilter);
            } else {
                console.log("setting symbols to filter from localStorage");
                setSymbolsToFilter(wsbWordsToFilterLocalStorage);
            }

        }

    }, [symbolsToFilter])

    function sortSubtract(a: any, b: any) {
        if (!sortDirection) {
            return b.freq - a.freq;
        } else {
            return a.freq - b.freq;
        }
    }

    //need better name
    function setValue(e: any) {
        setMinFrequencyToDisplay(e.target.value);
    }

    function printFilteredWords() {
        if (symbolsToFilter != undefined) {
            let size = symbolsToFilter.length;

            let string = "";
            for (let i = 0; i < size; i++) {
                string += symbolsToFilter[i] + ", "
            }
            return string;
        } else {
            return "symbol list not loaded";
        }

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

    function addSymbolToFilter() {
        if (symbolsToFilter != undefined) {

            let localStorageUpdate: any = [...symbolsToFilter];
            localStorageUpdate.push(symbolsToFilterUpdate);
            console.log("adding new symbol to filter");
            setSymbolsToFilter((symbolsToFilter) => [...symbolsToFilter, symbolsToFilterUpdate]);
            setSymbolsToFilterUpdate("");

            localStorage.setItem("wsbWordsToFilter", JSON.stringify(localStorageUpdate));
        } else {
            console.log("symbols to filter is undefined");
        }

    }

    function removeSymbolFromFilter() {
        setSymbolsToFilter(symbolsToFilter.filter(item => item !== symbolsToFilterUpdate));
        let localStorageUpdate: any = symbolsToFilter.filter(item => item !== symbolsToFilterUpdate)
        localStorage.setItem("wsbWordsToFilter", JSON.stringify(localStorageUpdate));

        setSymbolsToFilterUpdate("");

    }

    function updateSymbolsToFilterUpdate(event: any) {
        setSymbolsToFilterUpdate(event.target.value)
    }

    function getSingleDayFrequencyDataFixed() {
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
            listToSort.push({ ticker: key, freq: value });
        }

        //sort listToSort

        listToSort.sort(sortSubtract);

        let sizeOfList = listToSort.length;
        for (let i = 0; i < sizeOfList; i++) {
            //console.log(`key: ${key} value: ${value}`);
            //can filter words here
            if (!symbolsToFilter.includes(listToSort[i].ticker)) {
                if (Number(listToSort[i].freq) > Number(minFrequencyToDisplay)) {
                    tickerLabels.push(listToSort[i].ticker);
                    tickerCount.push(listToSort[i].freq);
                    var o = Math.round, r = Math.random, s = 255;
                    let barBorder = 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 0.2 + ')';
                    let barColor = 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')'
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

    function getFrequenclyListsDatesArray() {
        let datesToPass: any = [];
        if (frequencyLists != undefined) {
            let size = frequencyLists.length;
            for (let i = 0; i < size; i++) {
                datesToPass.push({ value: frequencyLists[i].date, label: frequencyLists[i].date });
            }
        }

        return datesToPass.reverse();
    }

    function changeSortDirection() {
        setSortDirection(!sortDirection);
    }



    return (

        <div className="singleDayFrequency">
            <p>View a frequency chart for a single day</p>
            <Select
                defaultValue={selectedOneDay}
                onChange={setSelectedOneDay}
                options={getFrequenclyListsDatesArray()}
            />
            <input type="button" onClick={singleDayFrequencyChartClicked} value="View Frequency Chart" />

            <p>Filtering Words: {printFilteredWords()}</p>
            <input type="text" value={symbolsToFilterUpdate} onChange={updateSymbolsToFilterUpdate} />
            <input type="button" onClick={addSymbolToFilter} value="Add" />
            <input type="button" onClick={removeSymbolFromFilter} value="Remove"></input>

            {singleDayFrequencyChartActive && selectedOneDay != null && oneDayFrequencyChartData != undefined &&
                <>
                    <p>Chart is active</p>
                    <input type="text" value={minFrequencyToDisplay} onChange={setValue} />
                    <input type="button" value="Change Sort Direction" onClick={changeSortDirection} />
                    <VerticalBar data={getSingleDayFrequencyDataFixed} options={{}} header={`Frequency Chart for ${selectedOneDay.value}`} />
                </>
            }
        </div>

    )
}


export default AllFrequencyData;
