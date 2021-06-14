import React, { useEffect, useState } from "react";
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

    useEffect(() => {

    }, [])

    function renderRealtimeChart(type: string) {

        let dataset: realtimeDataItem[];
        let tickersToChart: string[];
        type == 'wsb' ? dataset = realtimeWsb : dataset = realtimeCrypto;
        type == 'wsb' ? tickersToChart = selectedWsbTickerList : tickersToChart = selectedCryptoTickerList;

        let size = dataset.length;
        let labels: string[] = [];

        //let datasets: number[] = [];
        //let datasets2: number[] = [];
        let tempData: { [key: string]: [number] } = {};

        //generate list of dates
        for (let i = 0; i < size; i++) {
            let d = new Date(dataset[i].createdAt);
            labels.push(d.toLocaleString('default', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
            let freqList = dataset[i].frequencyList;
            let sizeOfTickersToChart = tickersToChart.length;
            for (let n = 0; n < sizeOfTickersToChart; n++) {
                let value = freqList[tickersToChart[n]];
                value != undefined ? value = value : value = 0;
                if (tempData[tickersToChart[n]] == undefined) {
                    tempData[tickersToChart[n]] = [value];
                } else {
                    tempData[tickersToChart[n]].push(value)
                }
            }
            // datasets.push(type == 'wsb' ? freqList['gme'] : freqList['btc']);
            //datasets2.push(type == 'wsb' ? freqList['amc'] : freqList['eth']);
        }
        //console.log(tempData);

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
                <p>Some popular example tickers to enter: {type == 'wsb' ? 'gme, amc' : 'btc, eth'}</p>
                <LineChart
                    data={dataToRender} options={{}}
                />
            </>
        )
    }

    return (
        <div className="realtime">
            <div className="loadPageForm">
                <input type="button" className={"subButton" + (pageSelected == 'single' ? ' navItemSelected' : '')} onClick={() => setPageSelected("single")} value="Single Ticker and sentiment analysis" />
                <input type="button" className={"subButton" + (pageSelected == 'all' ? ' navItemSelected' : '')} onClick={() => setPageSelected("all")} value="Multiple Ticker View" />
            </div>

            {pageSelected == 'all' ? (
                <>
                    <input type="button" className="subButton" value={hideRealTimeWsb == false ? 'Hide Realtime WSB' : 'Expand Realtime WSB'} onClick={() => setHideRealTimeWsb(!hideRealTimeWsb)} />
                    <input type="button" className="subButton" value={hideRealTimeCrypto == false ? 'Hide Realtime Crypto' : 'Expand Realtime Crypto'} onClick={() => setHideRealTimeCrypto(!hideRealTimeCrypto)} />

                    {realtimeWsb == undefined &&
                        <p>Loading Realtime WSB Data</p>
                    }
                    {realtimeWsb != undefined &&
                        <>
                            {hideRealTimeWsb == false &&
                                <>
                                    <ToggleTickersControl type={'wsb'} realtimedata={realtimeWsb} selectedTickerList={selectedWsbTickerList} setSelectedTickerList={setSelectedWsbList} colorList={colorList} setColorList={setColorList} />
                                    {renderRealtimeChart('wsb')}
                                </>
                            }
                        </>
                    }
                    {realtimeCrypto == undefined &&
                        <p>Loading Realtime Crypto Data</p>
                    }
                    {realtimeCrypto != undefined &&
                        <>
                            {hideRealTimeCrypto == false &&
                                <>
                                    <ToggleTickersControl type={'crypto'} realtimedata={realtimeCrypto} selectedTickerList={selectedCryptoTickerList} setSelectedTickerList={setSelectedCryptoTickerList} colorList={colorList} setColorList={setColorList} />
                                    {renderRealtimeChart('crypto')}
                                </>
                            }
                        </>
                    }
                </>
            ) : (
                true
            )}


        </div>

    )
}


export default RealTimeData;
