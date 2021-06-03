import React, { useEffect, useState } from "react";

type Props = SingleTickerQueriesProps;

const SingleTickerQueries: React.FC<Props> = ({ selectedTicker, frequencyOverTime, historicalPrices }) => {

    const [comparisonValue, setComparisonValue] = useState<string>('');
    const [comparisonSign, setComparisonSign] = useState<string>('greater');
    const [numEntries, setNumEntries] = useState<string>('');
    const [daysBetweenFilter, setDaysbetweenFilter] = useState<string>('');
    const [minimumFrequency, setMinimumFrequency] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('');

    //not sure how I want this to endup
    interface singleTickerQuery {
        dayBefore: yahooStockHistoricalPrices
        dayOf: yahooStockHistoricalPrices
        dayAfter: yahooStockHistoricalPrices
        dayAfter1: yahooStockHistoricalPrices
        dayAfter2: yahooStockHistoricalPrices

    }
    const [singleTickerQuery, setSingleTickerQuery] = useState<Array<singleTickerQuery>>();

    function treatAsUTC(date: any) {
        let result: any = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }

    function daysBetween(startDate: Date, endDate: Date) {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
    }

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
        let reversed = [...historicalPrices.reverse()];

        //skip first day since we are checking the past days to compare
        for (let i = 1; i < size; i++) {

            if (frequencyOverTime[i].freq < minimumFrequency) {
                continue;
            }
            //console.log(frequencyOverTime[i].freq);

            //check to make sure comparing day before and day of i
            let dayBefore = new Date(frequencyOverTime[i - 1].date);
            let dayOf = new Date(frequencyOverTime[i].date);


            if (daysBetween(dayBefore, dayOf) <= Number(daysBetweenFilter)) {
                let ratio = frequencyOverTime[i].freq / frequencyOverTime[i - 1].freq;
                //console.log(ratio);
                let comparison;
                if (comparisonSign == 'greater') {
                    comparison = ratio >= Number(comparisonValue)
                }
                if (comparisonSign == 'less') {
                    comparison = ratio <= Number(comparisonValue)
                }
                if (comparison) {
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
                                } else {
                                    console.log("err");
                                }
                            }
                        }
                    }
                    //console.log(currentDate.toDateString());
                    //in historicalPrices array date is a unix time int
                }
            }
            console.log(`Count: ${count} Count2: ${count2}`);

        }

        console.log(`Count: ${count} Count2: ${count2}`);

        if (result.length == 0) {
            alert('No entries found, returning');
            return;
        }
        console.log(result);
        //setNumEntries(`${count2}`);
        //setSingleTickerQuery(result);
    }

    function updateComparisonValue(event: any) {
        setComparisonValue(event.target.value)
    }

    function getPercentChange(initial: number, final: number) {
        let change = final - initial;
        let ratio = change / initial;
        let percent = ratio * 100;
        return percent;
    }

    function removeDecimals(inNum: number) {

        return Number(inNum.toFixed(2));
    }
    function renderCaluclations(currentEntry: singleTickerQuery) {

        let openToHigh = getPercentChange(Number(currentEntry.dayOf.open), Number(currentEntry.dayOf.high));
        let openToClose = getPercentChange(Number(currentEntry.dayOf.open), Number(currentEntry.dayOf.close));
        let openToLow = getPercentChange(Number(currentEntry.dayOf.open), Number(currentEntry.dayOf.low));
        let openToDayAfterOpen = getPercentChange(Number(currentEntry.dayOf.open), Number(currentEntry.dayAfter.open));
        let openToDayAfterClose = getPercentChange(Number(currentEntry.dayOf.open), Number(currentEntry.dayAfter.close));
        let openToDayAfterHigh = getPercentChange(Number(currentEntry.dayOf.open), Number(currentEntry.dayAfter.high));

        return (
            <ul>
                <li>Open to high <span className={openToHigh > 0 ? 'green' : 'red'}>{removeDecimals(openToHigh)} %</span></li>
                <li>Open to close <span className={openToClose > 0 ? 'green' : 'red'}>{removeDecimals(openToClose)} %</span></li>
                <li>Open to low <span className={openToLow > 0 ? 'green' : 'red'}>{removeDecimals(openToLow)} %</span></li>
                <li>Open to next day open <span className={openToDayAfterOpen > 0 ? 'green' : 'red'}>{removeDecimals(openToDayAfterOpen)} %</span></li>
                <li>Open to next day close <span className={openToDayAfterClose > 0 ? 'green' : 'red'}>{removeDecimals(openToDayAfterClose)} %</span></li>
                <li>Open to next day high <span className={openToDayAfterHigh > 0 ? 'green' : 'red'}>{removeDecimals(openToDayAfterHigh)} %</span></li>
            </ul>
        )
    }

    function renderTable(currentEntry: singleTickerQuery) {


        //dont like hardcoding this but doing it dynamically sucks just as much
        return (
            <div className="dataSegment">
                <table>
                    <tr>
                        <th>Date</th>
                        <th>Open</th>
                        <th>Close</th>
                        <th>Low</th>
                        <th>High</th>
                        <th>Volume</th>
                    </tr>
                    {currentEntry.dayBefore != undefined &&
                        <tr>
                            <td>{new Date(currentEntry.dayBefore.date * 1000).toDateString()}</td>
                            <td>{Number(currentEntry.dayBefore.open).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayBefore.close).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayBefore.low).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayBefore.high).toFixed(3)}</td>
                            <td>{currentEntry.dayBefore.volume}</td>
                        </tr>
                    }

                    {currentEntry.dayOf != undefined &&
                        <tr>
                            <td>{new Date(currentEntry.dayOf.date * 1000).toDateString()}</td>
                            <td>{Number(currentEntry.dayOf.open).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayOf.close).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayOf.low).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayOf.high).toFixed(3)}</td>
                            <td>{currentEntry.dayOf.volume}</td>
                        </tr>
                    }
                    {currentEntry.dayAfter != undefined &&
                        <tr>

                            <td>{new Date(currentEntry.dayAfter.date * 1000).toDateString()}</td>
                            <td>{Number(currentEntry.dayAfter.open).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayAfter.close).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayAfter.low).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayAfter.high).toFixed(3)}</td>
                            <td>{currentEntry.dayAfter.volume}</td>
                        </tr>
                    }
                    {currentEntry.dayAfter1 != undefined &&
                        <tr>
                            <td>{new Date(currentEntry.dayAfter1.date * 1000).toDateString()}</td>
                            <td>{Number(currentEntry.dayAfter1.open).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayAfter1.close).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayAfter1.low).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayAfter1.high).toFixed(3)}</td>
                            <td>{currentEntry.dayAfter1.volume}</td>
                        </tr>
                    }
                    {currentEntry.dayAfter2 != undefined &&
                        <tr>
                            <td>{new Date(currentEntry.dayAfter2.date * 1000).toDateString()}</td>
                            <td>{Number(currentEntry.dayAfter2.open).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayAfter2.close).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayAfter2.low).toFixed(3)}</td>
                            <td>{Number(currentEntry.dayAfter2.high).toFixed(3)}</td>
                            <td>{currentEntry.dayAfter2.volume}</td>
                        </tr>
                    }
                </table>

                {renderCaluclations(currentEntry)}
            </div>

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
                <p>How many days prior to search for increase</p>
                <input type="text" value={daysBetweenFilter} onChange={(e) => setDaysbetweenFilter(e.target.value)} />
                <p>Minimum frequency filter</p>
                <input type="text" value={minimumFrequency} onChange={(e) => setMinimumFrequency(e.target.value)} />
                <p>Select Days after: </p>
                <input type="date" value={dateFilter} onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => setDateFilter(ev.target.value)} />
            </div>

            <input type="button" onClick={executeQuery} value="Execute" />

            {singleTickerQuery != undefined && comparisonValue.length > 0 &&
                <>
                    <p>There are {numEntries} Entries</p>
                    {singleTickerQuery.map((dataPoint: singleTickerQuery) =>
                        renderTable(dataPoint)
                    )}
                </>
            }
        </div>
    )
}


export default SingleTickerQueries;
