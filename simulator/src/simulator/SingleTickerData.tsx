import React, { useEffect, useState } from "react";
import LineChart from "../charts/LineChart";
import { getCurrentData, getCurrentPrice, getHistoricalPrices } from '../API'
import Chart from 'kaktana-react-lightweight-charts'


type Props = singleTickerDataProps;

const SingleTickerData: React.FC<Props> = ({ frequencyLists }) => {

    const [selectedTicker, setSelectedTicker] = useState<any>("");
    const [frequencyOverTime, setFrequencyOverTime] = useState<any>(null);
    const [fixedHistoricalPrices, setFixedHistoricalPrices] = useState<any>(null);
    const [fixedVolumeData, setFixedVolumeData] = useState<any>(null);
    const [historicalPrices, setHistoricalPrices] = useState<any>(null);
    const [isCondensedView, setCondensedview] = useState<boolean>(true);

    const fetchHistoricalPrices = (_startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
        getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, _ticker, _frequency)
            .then(({ data: { historicalPrices } }: any) => setHistoricalPrices(historicalPrices))
            .catch((err: Error) => console.log(err))
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

    if (historicalPrices != undefined && fixedHistoricalPrices == undefined) {
        fixHistoricalPrices();
    }

    if (historicalPrices != undefined && fixedVolumeData == undefined) {
        fixVolumeData();
    }

    return (
        <div className="tickerFreqOverTime">
            <p>View the frequency of a ticker over time</p>
            <input type="text" value={selectedTicker} onChange={e => setSelectedTicker(e.target.value)} />
            <input type="button" onClick={frequencyOverTimeClicked} value="View Ticker Frequency Over Time" />

            <input type="button" value={isCondensedView ? 'Expand' : 'Condense'} onClick={() => setCondensedview(!isCondensedView)} />

            {frequencyOverTime != undefined &&
                <>
                    <div className="charts">
                        <LineChart data={getFrequencyOverTimeFixed} options={{}} />
                        <div className={isCondensedView ? "twoChartsCondensed" : "twoChartsExpanded"}>
                            <div className={isCondensedView ? "chartCondensed" : "chartExpanded"}>
                                {fixedHistoricalPrices &&
                                    renderStockChart()
                                }
                            </div>
                            <div className={isCondensedView ? "chartCondensed" : "chartExpanded"}>
                                {fixedVolumeData &&
                                    renderVolumeChart()
                                }
                            </div>
                        </div>
                    </div>
                </>
            }

        </div>
    )
}


export default SingleTickerData;
