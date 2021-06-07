import React, { useEffect, useState } from "react";
import LineChart from "../charts/LineChart";
import { getCurrentData, getCurrentPrice, getHistoricalPrices } from '../API'
import Chart from 'kaktana-react-lightweight-charts'
import SingleTickerQueries from './SingleTickerQueries';
import CoinGecko from 'coingecko-api';

type Props = singleTickerDataProps;

const SingleTickerData: React.FC<Props> = ({ frequencyLists, dataSourceSelected }) => {

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

    function fixCryptoHistoricalPrices() {
        console.log(`fixing ${selectedTicker} historical prices`);

        let size = historicalPrices.prices.length;

        let tempHistoricalPrices: Array<areaSeriesType> = [];
        for (let i = 0; i < size; i++) {
            tempHistoricalPrices[i] = { time: historicalPrices.prices[i][0] / 1000, value: Number(historicalPrices.prices[i][1]) };
        }
        setFixedHistoricalPrices(tempHistoricalPrices);
    }

    function fixCryptoVolumeData() {
        console.log(`fixing ${selectedTicker} volume data`);

        let size = historicalPrices.prices.length;

        let tempVolumeData: Array<areaSeriesType> = [];
        for (let i = 0; i < size; i++) {
            tempVolumeData[i] = { time: historicalPrices.total_volumes[i][0] / 1000, value: Number(historicalPrices.total_volumes[i][1]) };
        }
        setFixedVolumeData(tempVolumeData);
    }

    function fetchCryptoHistoricalPrices(startDate: Date, endDate: Date, selectedTicker: string) {
        console.log(`fetching historical prices for ${selectedTicker}`);

        //get coin id

        const CoinGeckoClient: any = new CoinGecko();

        let func = async () => {
            let response = await CoinGeckoClient.coins.list();
            //console.log(response.data);

            let size = response.data.length;

            for (let i = 0; i < size; i++) {
                if (response.data[i].symbol == selectedTicker || response.data[i].name == selectedTicker) {
                    //need to convert dates to unix time to pass
                    //correct id found, can do other api call out of this loop
                    let data = await CoinGeckoClient.coins.fetchMarketChartRange(response.data[i].id, {
                        from: startDate.getTime() / 1000,
                        to: endDate.getTime() / 1000,
                        vs_currency: 'usd',
                        include_market_cap: true,
                        include_24hr_change: true,
                    });
                    //console.log(`id: ${response.data[i].id} from ${startDate.getTime()} to ${endDate.getTime()} for ticker `)
                    //set data, 
                    //console.log(data);
                    setHistoricalPrices(data.data);
                    //then break
                    break;
                }
            }
        };

        func();
        //get and set coin historical data
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
            let dateObj = new Date(frequencyOverTime[i].date);
            dateLabels.push(dateObj.toDateString());
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
                <Chart options={options} darkTheme={true} areaSeries={areaSeries} autoWidth height={500} />
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

        if (selectedTickerData.length == 0) {
            alert(`${selectedTicker} is  not a valid entry`);
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
        let endDate = new Date(Date.now())
        //let endDate = new Date(selectedTickerData[selectedTickerData.length - 1].date);

        if (dataSourceSelected == 'wsb') {
            fetchHistoricalPrices(`${startDate.getMonth()}`, `${startDate.getDate()}`, `${startDate.getFullYear()}`, `${endDate.getMonth()}`, `${endDate.getDate()}`, `${endDate.getFullYear()}`, selectedTicker, "1d");
        }
        if (dataSourceSelected == 'crypto') {
            fetchCryptoHistoricalPrices(startDate, endDate, selectedTicker);
        }

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
                <Chart options={options} darkTheme={true} areaSeries={areaSeries} autoWidth height={500} />
            </div>
        )

    }

    if (historicalPrices != undefined && fixedHistoricalPrices == undefined) {
        if (dataSourceSelected == 'wsb') {
            fixHistoricalPrices();
        } else {
            //console.log(historicalPrices.prices);
            fixCryptoHistoricalPrices();
        }
    }

    if (historicalPrices != undefined && fixedVolumeData == undefined) {
        if (dataSourceSelected == 'wsb') {
            fixVolumeData();
        } else {
            fixCryptoVolumeData();
        }
    }

    return (
        <div className="tickerFreqOverTime">
            <p>View the frequency of a {dataSourceSelected == 'wsb' ? 'ticker' : 'coin'} over time</p>
            <input type="text" className="textInput" value={selectedTicker} onChange={e => setSelectedTicker(e.target.value)} />
            <input type="button" className="subButton" onClick={frequencyOverTimeClicked} value="View Ticker Frequency Over Time" />

            <input type="button" className="subButton" value={isCondensedView ? 'Expand' : 'Condense'} onClick={() => setCondensedview(!isCondensedView)} />

            {frequencyOverTime != undefined &&
                <>
                    <div className="charts">
                        <div className="topChart">
                            <LineChart data={getFrequencyOverTimeFixed} options={{}} />
                        </div>
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

                    {dataSourceSelected == 'wsb' &&
                        <SingleTickerQueries
                            selectedTicker={selectedTicker}
                            frequencyOverTime={frequencyOverTime}
                            historicalPrices={historicalPrices}
                        />
                    }
                </>
            }

        </div>
    )
}


export default SingleTickerData;
