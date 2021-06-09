import React, { useEffect, useState } from "react";
import { getRealTimeCrypto, getRealTimeWsb } from "../API";
import LineChart from "../charts/LineChart";
import ToggleTickersControl from "./ToggleTickersControl";

type Props = realtimedataProps;

const RealTimeData: React.FC<Props> = () => {

    const [realtimeCrypto, setRealTimeCrypto] = useState<any>();
    const [realtimeWsb, setRealTimeWsb] = useState<any>();

    useEffect(() => {
        async function loadFromServerIntoState() {
            if (realtimeCrypto == undefined) {
                console.log("getting realtime crypto")
                let data = await getRealTimeCrypto()
                setRealTimeCrypto(data.data.realtimeList);
            }
            if (realtimeWsb == undefined) {
                console.log("getting realtime wsb")
                let data = await getRealTimeWsb()
                setRealTimeWsb(data.data.realtimeList);
            }
        }
        loadFromServerIntoState()
    }, [])

    function renderRealtimeChart(type: string) {

        let dataset: realtimeDataItem[];
        type == 'wsb' ? dataset = realtimeWsb : dataset = realtimeCrypto;

        let size = dataset.length;
        let labels: string[] = [];

        let datasets: number[] = [];
        let datasets2: number[] = [];
        //generate list of dates
        for (let i = 0; i < size; i++) {
            let d = new Date(dataset[i].createdAt);
            labels.push(d.toLocaleString('default', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
            let freqList = dataset[i].frequencyList;
            datasets.push(type == 'wsb' ? freqList['gme'] : freqList['btc']);
            datasets2.push(type == 'wsb' ? freqList['amc'] : freqList['eth']);
        }

        const dataToRender = {
            labels: labels,
            datasets: [
                {
                    key: 1,
                    label: 'btc',
                    data: datasets,
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                },
                {
                    key: 2,
                    label: 'eth',
                    data: datasets2,
                    fill: false,
                    backgroundColor: 'rgb(100, 59, 132)',
                    borderColor: 'rgba(100, 59, 132, 0.2)',
                },
            ],
        }


        return (
            <>
                <p>Chart for {type}</p>
                <LineChart
                    data={dataToRender} options={{}}
                />
            </>
        )
    }


    return (
        <div className="realtime">
            <p>realtime data</p>
            {realtimeWsb == undefined &&
                <p>Loading Realtime WSB Data</p>
            }
            {realtimeWsb != undefined &&
                <>
                    <ToggleTickersControl type={'wsb'} realtimedata={realtimeWsb}/>
                    {renderRealtimeChart('wsb')}
                </>
            }
            {realtimeCrypto == undefined &&
                <p>Loading Realtime Crypto Data</p>
            }
            {realtimeCrypto != undefined &&
                <>
                    <ToggleTickersControl type={'crypto'} realtimedata={realtimeCrypto} />
                    {renderRealtimeChart('crypto')}
                </>
            }
        </div>

    )
}


export default RealTimeData;
