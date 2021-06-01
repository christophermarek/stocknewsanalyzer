import React, { useEffect, useState } from "react";
import VerticalBar from '../charts/VerticalBar';
import SelectDayControls from "./SelectDayControls";
import WordFilterControls from './WordFilterControls';

const wsbSymbolsToFilter = ['is', 'at', 'are', 'open', 'for', 'lmao', 'now', 'on', 'bro', 'new', 'a', 'so', 'or', 'it', 'two', 'by', 'has', 'any', 'tell', 'out', 'hope', 'most', 'huge', 'pump', 'life', 'real', 'cash', 'apps', 'wow', 'very', 'link', 'find', 'best', 'big', 'low'];

type Props = allFrequencyDataProps;

const AllFrequencyData: React.FC<Props> = ({ frequencyLists }) => {

    const [symbolsToFilter, setSymbolsToFilter] = useState<Array<String>>(new Array());
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

    function getSingleDayFrequencyDataFixed() {
        //want to skip entries with frequency < n
        let tickerLabels = [];
        let tickerCount = [];
        let backgroundColor = [];
        let borderColor = [];
        let listToSort = [];

        for (let [key, value] of Object.entries(oneDayFrequencyChartData.freqList)) {
            listToSort.push({ ticker: key, freq: value });
        }
        listToSort.sort(sortSubtract);

        let sizeOfList = listToSort.length;
        for (let i = 0; i < sizeOfList; i++) {
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

    function changeSortDirection() {
        setSortDirection(!sortDirection);
    }

    return (

        <div className="singleDayFrequency">
            <SelectDayControls
                frequencyLists={frequencyLists}
                selectedOneDay={selectedOneDay}
                setSelectedOneDay={setSelectedOneDay}
                setSingleDayFrequencyChartActive={setSingleDayFrequencyChartActive}
                setOneDayFrequencyChartData={setOneDayFrequencyChartData}
            />
            <WordFilterControls
                symbolsToFilter={symbolsToFilter}
                setSymbolsToFilter={setSymbolsToFilter}
            />
            {singleDayFrequencyChartActive && selectedOneDay != null && oneDayFrequencyChartData != undefined &&
                <>
                    <div className="minFrequencyToDisplayControl">
                        <input type="text" className="textInput" value={minFrequencyToDisplay} onChange={setValue} />
                        <p>Minimum Frequency To Display</p>
                    </div>
                    <div className="sortDirectionControl">
                        <input type="button" className="subButton" value="Change Sort Direction" onClick={changeSortDirection} />
                    </div>
                    <VerticalBar data={getSingleDayFrequencyDataFixed} options={{}} header={`Frequency Chart for ${selectedOneDay.value}`} />
                </>
            }
        </div>

    )
}


export default AllFrequencyData;
