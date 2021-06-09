import React, { useEffect, useState } from "react";

type Props = toggleTickersControlProps;

const ToggleTickersControl: React.FC<Props> = ( { type, realtimedata} ) => {
    
    const [tickerList, setTickerList] = useState<object>();

    useEffect(() => {

        if(tickerList == undefined){
            let temp: object = {};
            let size = realtimedata.length;
            //dont think this will preserve frequency, just gets all keys and removes duplicates
            for(let i = 0; i < size; i++){
                temp = {...temp, ...(realtimedata[i].frequencyList)};
            }
            setTickerList(temp);
        }

    }, [])
    

    return (
        <div className='ToggleTickersControl'>
            <p>Toggle active for {type}</p>
        </div>
    )
}


export default ToggleTickersControl;
;
