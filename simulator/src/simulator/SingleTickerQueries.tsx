import React, { useEffect, useState } from "react";

type Props = SingleTickerQueriesProps;

const SingleTickerQueries: React.FC<Props> = ({ selectedTicker, frequencyOverTime, historicalPrices }) => {

    const [comparisonValue, setComparisonValue] = useState<string>('');
    const [comparisonSign, setComparisonSign] = useState<string>('greater');
    //not sure how I want this to endup
    interface singleTickerQuery {
        dayBefore: yahooStockHistoricalPrices
        dayOf: yahooStockHistoricalPrices
        dayAfter: yahooStockHistoricalPrices
        dayAfter1: yahooStockHistoricalPrices
        dayAfter2: yahooStockHistoricalPrices

    }
    const [singleTickerQuery, setSingleTickerQuery] = useState<Array<singleTickerQuery>>();

    function executeQuery() {
        console.log(`Executing query on ${selectedTicker}, checking occurences when ${comparisonValue} times ${comparisonSign} than the past day`);

        console.log(frequencyOverTime);

        let result = [];

        let size = frequencyOverTime.length;
        let sizeOfHistoricalPrices = historicalPrices.length;
        //there are count = 85 but count2 = 81 so there are entries that are not matching properly. Fix
        let count = 0
        let count2 = 0;

        console.log(historicalPrices);

        //historicalPrices is the wrong way
        let reversed = historicalPrices.reverse();

        //skip first day since we are checking the past days to compare
        for (let i = 1; i < size; i++) {
            //console.log(frequencyOverTime[i].freq);
            if (frequencyOverTime[i - 1].freq < frequencyOverTime[i].freq) {
                //console.log(`frequency increase at date: ${frequencyOverTime[i].date}`);
                //need to create a date object
                //get the stock price for the day before, day of, and next 7 days. 
                //can do this with historical prices.
                //result.push({before: frequencyOverTim]})
                count += 1;

                let currentDate = new Date(frequencyOverTime[i].date);
                //console.log(currentDate);
                for (let n = 0; n < sizeOfHistoricalPrices; n++) {

                    //since we cant control for exact seconds we need to compare day
                    let historicalPrice = new Date(reversed[n].date * 1000);

                    let currYear = currentDate.getFullYear();
                    let currMonth = currentDate.getMonth();
                    let currDay = currentDate.getDate();

                    let compYear = historicalPrice.getFullYear();
                    let compMonth = historicalPrice.getMonth();
                    let compDay = historicalPrice.getDate();

                    if (currDay == compDay) {
                        if (currMonth == compMonth) {
                            if (currYear == compYear) {
                                count2 += 1;
                                result.push({
                                    dayBefore: reversed[n - 1],
                                    dayOf: reversed[n],
                                    dayAfter: reversed[n + 1],
                                    dayAfter1: reversed[n + 2],
                                    dayAfter2: reversed[n + 3],
                                });
                            }
                        }
                    }
                }
                //console.log(currentDate.toDateString());
                //in historicalPrices array date is a unix time int
            }
        }
        console.log(`Count: ${count} Count2: ${count2}`);
        setSingleTickerQuery(result);
    }

    function updateComparisonValue(event: any) {
        setComparisonValue(event.target.value)
    }

    function renderTable(currentEntry: singleTickerQuery) {
        //dont like hardcoding this but doing it dynamically sucks just as much
        return (
            <table>
                <tr>
                    <th>Date</th>
                    <th>Open</th>
                    <th>Close</th>
                    <th>Low</th>
                    <th>High</th>
                    <th>Volume</th>
                </tr>
                <tr>
                    <td>{new Date(currentEntry.dayBefore.date * 1000).toDateString()}</td>
                    <td>{Number(currentEntry.dayBefore.open).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayBefore.close).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayBefore.low).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayBefore.high).toFixed(3)}</td>
                    <td>{currentEntry.dayBefore.volume}</td>
                </tr>
                <tr>
                    <td>{new Date(currentEntry.dayOf.date * 1000).toDateString()}</td>
                    <td>{Number(currentEntry.dayOf.open).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayOf.close).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayOf.low).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayOf.high).toFixed(3)}</td>
                    <td>{currentEntry.dayOf.volume}</td>
                </tr>
                <tr>
                    <td>{new Date(currentEntry.dayAfter.date * 1000).toDateString()}</td>
                    <td>{Number(currentEntry.dayAfter.open).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayAfter.close).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayAfter.low).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayAfter.high).toFixed(3)}</td>
                    <td>{currentEntry.dayAfter.volume}</td>
                </tr>
                <tr>
                    <td>{new Date(currentEntry.dayAfter1.date * 1000).toDateString()}</td>
                    <td>{Number(currentEntry.dayAfter1.open).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayAfter1.close).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayAfter1.low).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayAfter1.high).toFixed(3)}</td>
                    <td>{currentEntry.dayAfter1.volume}</td>
                </tr>
                <tr>
                    <td>{new Date(currentEntry.dayAfter2.date * 1000).toDateString()}</td>
                    <td>{Number(currentEntry.dayAfter2.open).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayAfter2.close).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayAfter2.low).toFixed(3)}</td>
                    <td>{Number(currentEntry.dayAfter2.high).toFixed(3)}</td>
                    <td>{currentEntry.dayAfter2.volume}</td>
                </tr>
            </table>
        )
    }

    return (
        <div className="singleTickerQueries">
            <p>Run queries on {selectedTicker}</p>

            <div className="dateOccurencesForm">
                <p>Get all date occurrences when {selectedTicker} frequency is </p>
                <input type="text" value={comparisonValue} onChange={updateComparisonValue} />
                <p> times {comparisonSign} than the day before</p>
                <input type="button" value="Change Comparison Sign" onClick={() => setComparisonSign(comparisonSign == 'greater' ? 'less' : 'greater')} />
            </div>

            <input type="button" onClick={executeQuery} value="Execute" />

            {singleTickerQuery != undefined &&
                singleTickerQuery.map((dataPoint: singleTickerQuery) =>
                    renderTable(dataPoint)
                )
            }
        </div>
    )
}


export default SingleTickerQueries;
