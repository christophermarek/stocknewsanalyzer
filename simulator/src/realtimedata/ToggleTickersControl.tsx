import React, { useEffect, useState } from "react";
import Select from 'react-select';

type Props = toggleTickersControlProps;

const ToggleTickersControl: React.FC<Props> = ({ type, realtimedata, selectedTickerList, setSelectedTickerList, colorList, setColorList }) => {

    const [tickerList, setTickerList] = useState<Array<object>>();
    const [selectedTicker, setSelectedTicker] = useState<any>();

    useEffect(() => {

        if (tickerList === undefined) {
            let temp: object = {};
            let size = realtimedata.length;
            //dont think this will preserve frequency, just gets all keys and removes duplicates
            for (let i = 0; i < size; i++) {
                temp = { ...temp, ...(realtimedata[i].frequencyList) };
            }

            let tempSelectData: object[] = [];
            //select takes [ {value: , label: }, {}, ...]
            for (const [key] of Object.entries(temp)) {
                tempSelectData.push({ value: key, label: key });
            }

            setTickerList(tempSelectData);
        }

    }, [realtimedata, tickerList])

    const selectedListItem = (event: any) => {
        setSelectedTicker(event.value);
        setSelectedTickerList(selectedTickerList?.concat(event.value));
        if(colorList[event.value] === undefined){
            let o = Math.round, r = Math.random, s = 255;
            let color = 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')';
            let temp = {...colorList};
            temp[event.value] = color;
            setColorList(temp);
        }
    }

    const removeFromList = (ticker: string) => {
        const newList = selectedTickerList.filter((item) => item !== ticker);
        setSelectedTickerList(newList);
    }

    const selectedListItems = selectedTickerList.map((ticker) =>
        <li key={ticker}>
            {`${ticker}      `}
            <input type="button" onClick={() => removeFromList(ticker)} value={'X'}/>
        </li>
    );

    return (
        <div className='ToggleTickersControl'>
            <p>Toggle active for {type}</p>
            {tickerList === undefined &&
                <p>Loading Selection</p>
            }
            {tickerList !== undefined &&
                <>
                    <Select
                        defaultValue={selectedTicker === undefined ? '' : selectedTicker}
                        onChange={selectedListItem}
                        options={tickerList}
                        className="dateInput"
                    />
                    {selectedTickerList.length > 0 ? (
                        <ul>
                            {selectedListItems}
                        </ul>
                    ) : (
                        <p>Select tickers to chart</p>
                    )}
                </>
            }
        </div>
    )
}

export default ToggleTickersControl;