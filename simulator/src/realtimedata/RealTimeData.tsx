import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import LineChart from "../charts/LineChart";
import ToggleTickersControl from "./ToggleTickersControl";

type Props = realtimedataProps;

const RealTimeData: React.FC<Props> = ({ realtimeCrypto, realtimeWsb }) => {

    const [selectedCryptoTickerList, setSelectedCryptoTickerList] = useState<Array<string>>([]);
    const [selectedWsbTickerList, setSelectedWsbList] = useState<Array<string>>([]);
    const [colorList, setColorList] = useState<any>({});
    const [hideRealTimeWsb, setHideRealTimeWsb] = useState<boolean>(false);
    const [hideRealTimeCrypto, setHideRealTimeCrypto] = useState<Boolean>(false);
    const [pageSelected, setPageSelected] = useState<string>('single');
    const [selectedTicker, setSelectedTicker] = useState<string>('');
    const [selectedMarket, setSelectedMarket] = useState<string>('wsb');
    const [dataReadyToRender, setDataReadyToRender] = useState<boolean>(false);

    function renderRealtimeChart(type: string) {

        let dataset: realtimeDataItem[];
        let tickersToChart: string[];
        type === 'wsb' ? dataset = realtimeWsb : dataset = realtimeCrypto;
        type === 'wsb' ? tickersToChart = selectedWsbTickerList : tickersToChart = selectedCryptoTickerList;
        let size = dataset.length;
        let labels: string[] = [];
        let tempData: { [key: string]: [number] } = {};

        //generate list of dates
        for (let i = 0; i < size; i++) {
            let d = new Date(dataset[i].createdAt);
            labels.push(d.toLocaleString('default', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
            let freqList = dataset[i].frequencyList;
            let sizeOfTickersToChart = tickersToChart.length;
            for (let n = 0; n < sizeOfTickersToChart; n++) {
                let value = freqList[tickersToChart[n]];
                value !== undefined ? value = value : value = 0;
                if (tempData[tickersToChart[n]] === undefined) {
                    tempData[tickersToChart[n]] = [value];
                } else {
                    tempData[tickersToChart[n]].push(value)
                }
            }
        }

        let datasets: object[] = [];
        for (const [key, value] of Object.entries(tempData)) {

            let data = {
                key: key,
                label: key,
                data: value,
                fill: false,
                backgroundColor: colorList[key],
                borderColor: colorList[key],
            }
            datasets.push(data);
        }

        const dataToRender = {
            labels: labels,
            datasets: datasets
        }

        return (
            <>
                <p>Chart for {type}</p>
                <p>Some popular example tickers to enter: {type === 'wsb' ? 'gme, amc' : 'btc, eth'}</p>
                <LineChart
                    data={dataToRender} options={{}}
                />
            </>
        )
    }


    const renderSentimentChart = () => {

        let dataSource = (selectedMarket === 'wsb' ? realtimeWsb : realtimeCrypto);
        let size = dataSource.length;
        let labels: string[] = [];
        let tempData: number[] = [];
        let negativeSentimentData: number[] = [];
        let positiveSentimentData: number[] = [];

        //generate list of dates
        for (let i = 0; i < size; i++) {
            //dates
            let d = new Date(dataSource[i].createdAt);
            labels.push(d.toLocaleString('default', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
            //freqList values and sentiment list
            let freqList = dataSource[i].frequencyList;
            let sentimentList = dataSource[i].sentimentList;
            if (freqList !== undefined) {
                let value = freqList[selectedTicker];
                value !== undefined ? value = value : value = 0;
                tempData.push(value)
            }
            if (sentimentList !== undefined) {
                let value = sentimentList[selectedTicker];
                value !== undefined ? value = value : value = [0];
                //So since the sentiment list is an array, for each timepoint it will be for now an average value
                let average = value.reduce((a:number, v:number, i:number)=>(a*i+v)/(i+1));
                //with chart at the end of the day its to big to have negative and positive, 
                //need to multiply by 10 to finish
                if(average > 0){
                    positiveSentimentData.push(average * 5);
                    negativeSentimentData.push(0);
                }else{
                    positiveSentimentData.push(0);
                    negativeSentimentData.push(average * 5);
                }
            }
        }

        let data = {
            labels: labels,
            datasets: [
                {
                    type: 'line',
                    label: 'Frequency',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1,
                    fill: true,
                    data: tempData
                },
                {
                    type: 'bar',
                    label: 'Scaled Positive Average Sentiment',
                    backgroundColor: 'rgb(50,205,50)',
                    borderColor: 'rgb(50,205,50)',
                    data: positiveSentimentData,
                    borderWidth: 1,
                },
                {
                    type: 'bar',
                    label: 'Scaled Negative Average Sentiment',
                    backgroundColor: 'rgb(255,0,0)',
                    borderColor: 'rgb(255,0,0)',
                    data: negativeSentimentData,
                    borderWidth: 1,
                },
               
            ],
        }

        return (
            <>
                <p>Chart with sentiment analysis over time</p>
                <Bar data={data} type="line" />
            </>
        )

    }

    return (
        <div className="realtime">
            <div className="loadPageForm">
                <input type="button" className={"subButton" + (pageSelected === 'single' ? ' navItemSelected' : '')} onClick={() => setPageSelected("single")} value="Single Ticker and Sentiment Analysis" />
                <input type="button" className={"subButton" + (pageSelected === 'all' ? ' navItemSelected' : '')} onClick={() => setPageSelected("all")} value="Multiple Ticker View" />
            </div>

            {pageSelected === 'all' ? (
                <>
                    <input type="button" className="subButton" value={hideRealTimeWsb === false ? 'Hide Realtime WSB' : 'Expand Realtime WSB'} onClick={() => setHideRealTimeWsb(!hideRealTimeWsb)} />
                    <input type="button" className="subButton" value={hideRealTimeCrypto === false ? 'Hide Realtime Crypto' : 'Expand Realtime Crypto'} onClick={() => setHideRealTimeCrypto(!hideRealTimeCrypto)} />

                    {realtimeWsb === undefined &&
                        <p>Loading Realtime WSB Data</p>
                    }
                    {realtimeWsb !== undefined &&
                        <>
                            {hideRealTimeWsb === false &&
                                <>
                                    <ToggleTickersControl type={'wsb'} realtimedata={realtimeWsb} selectedTickerList={selectedWsbTickerList} setSelectedTickerList={setSelectedWsbList} colorList={colorList} setColorList={setColorList} />
                                    {renderRealtimeChart('wsb')}
                                </>
                            }
                        </>
                    }
                    {realtimeCrypto === undefined &&
                        <p>Loading Realtime Crypto Data</p>
                    }
                    {realtimeCrypto !== undefined &&
                        <>
                            {hideRealTimeCrypto === false &&
                                <>
                                    <ToggleTickersControl type={'crypto'} realtimedata={realtimeCrypto} selectedTickerList={selectedCryptoTickerList} setSelectedTickerList={setSelectedCryptoTickerList} colorList={colorList} setColorList={setColorList} />
                                    {renderRealtimeChart('crypto')}
                                </>
                            }
                        </>
                    }
                </>
            ) : (
                <>
                    {realtimeCrypto === undefined &&
                        <p>Loading Realtime Crypto Data</p>
                    }
                    {realtimeWsb === undefined &&
                        <p>Loading Realtime WSB Data</p>
                    }
                    {realtimeCrypto !== undefined && realtimeWsb !== undefined &&
                        <>
                            <p>View the frequency of a ticker and sentiment over time, (Since 4:00 am UTC)</p>
                            <input type="text" className="textInput" value={selectedTicker} onChange={e => setSelectedTicker(e.target.value)} />
                            <input type="radio" value="wsb" name="selectedmarket" checked={selectedMarket === 'wsb'} onChange={(e) => setSelectedMarket(e.target.value)} /> WSB
                            <input type="radio" value="crypto" name="selectedmarket" checked={selectedMarket === 'crypto'} onChange={(e) => setSelectedMarket(e.target.value)} /> Cryptocurrency
                            <input type="button" className="subButton" onClick={() => setDataReadyToRender(true)} value="View" />

                            {dataReadyToRender &&
                                renderSentimentChart()
                            }
                        </>
                    }
                </>
            )}
        </div>
    )
}

export default RealTimeData;
