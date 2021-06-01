import * as React from "react";
import LineChart from "../charts/LineChart";


type Props = singleTickerDataProps;

const SingleTickerData: React.FC<Props> = ({ selectedTicker, setSelectedTicker, frequencyOverTimeClicked, frequencyOverTime, getFrequencyOverTimeFixed, fixedHistoricalPrices, renderStockChart, renderVolumeChart, fixedVolumeData }) => {

    return (
        <div className="tickerFreqOverTime">
            <p>View the frequency of a ticker over time</p>
            <input type="text" value={selectedTicker} onChange={e => setSelectedTicker(e.target.value)} />
            <input type="button" onClick={frequencyOverTimeClicked} value="View Ticker Frequency Over Time" />



            {frequencyOverTime != undefined &&
                <>
                    <div className="charts">
                        <div className="chart-container">
                            <LineChart data={getFrequencyOverTimeFixed} options={{}} />
                        </div>

                        {fixedHistoricalPrices &&
                            renderStockChart()
                        }

                        {fixedVolumeData &&
                            renderVolumeChart()
                        }
                    </div>
                </>
            }
        </div>
    )
}


export default SingleTickerData;
