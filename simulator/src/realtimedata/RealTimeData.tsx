import React, { useEffect, useState } from "react";
import { getRealTimeCrypto, getRealTimeWsb } from "../API";
import LineChart from "../charts/LineChart";

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
        //generate list of dates
        for (let i = 0; i < size; i++) {
            let d = new Date(dataset[i].createdAt);
            labels.push(d.toLocaleString('default', { month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' }));
        }

        console.log(labels);
        const dataToRender = {
            labels: labels,
            datasets: [
                {
                    label: 'Frequency over time, 1 minute interval chart',
                    data: [12, 19, 3, 5, 2, 3],
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
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
                renderRealtimeChart('wsb')
            }
            {realtimeCrypto == undefined &&
                <p>Loading Realtime Crypto Data</p>
            }
            {realtimeCrypto != undefined &&
                renderRealtimeChart('crypto')
            }
        </div>

    )
}


export default RealTimeData;
