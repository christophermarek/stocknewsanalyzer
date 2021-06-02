import React, { useEffect, useState } from "react";

type Props = SingleTickerQueriesProps;

const SingleTickerQueries: React.FC<Props> = ({ selectedTicker, frequencyOverTime, historicalPrices }) => {

    const [comparisonValue, setComparisonValue] = useState<string>('');
    const [comparisonSign, setComparisonSign] = useState<string>('greater');
    //not sure how I want this to endup
    const [singleTickerQuery, setSingleTickerQuery] = useState<any>();

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
                    let historicalPrice = new Date(historicalPrices[n].date * 1000);

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
                                    dayBefore: historicalPrices[n - 1],
                                    dayOf: historicalPrices[n],
                                    dayAfter: historicalPrices[n + 1],
                                    dayAfter1: historicalPrices[n + 2],
                                    dayAfter2: historicalPrices[n + 3],
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
        
    }

    function updateComparisonValue(event: any) {
        setComparisonValue(event.target.value)
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
        </div>
    )
}


export default SingleTickerQueries;
