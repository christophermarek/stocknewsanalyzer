import React, { useEffect, useState } from "react";
import { getRealTimeCrypto, getRealTimeWsb } from "../API";

type Props = realtimedataProps;

const RealTimeData: React.FC<Props> = () => {

    const [realtimeCrypto, setRealTimeCrypto] = useState<any>();
    const [realtimeWsb, setRealTimeWsb] = useState<any>();

    useEffect(() => {
        async function loadFromServerIntoState() {
            if (realtimeCrypto == undefined) {
                console.log("getting realtime crypto")
                let data = await getRealTimeCrypto()
                setRealTimeCrypto(data.data);
            }
            if (realtimeWsb == undefined) {
                console.log("getting realtime wsb")
                let data = await getRealTimeWsb()
                setRealTimeWsb(data.data);
            }
        }
        loadFromServerIntoState()
    }, [])


    return (
        <p>realtime data</p>
    )
}


export default RealTimeData;
