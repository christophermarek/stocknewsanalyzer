import React, { useEffect, useState } from "react";

type Props = SingleTickerQueriesProps;

const SingleTickerQueries: React.FC<Props> = ({ selectedTicker }) => {

    const [comparisonValue, setComparisonValue] = useState<string>('');
    const [comparisonSign, setComparisonSign] = useState<string>('greater');

    function executeQuery() {
        console.log(`Executing query on ${selectedTicker}, checking occurences when ${comparisonValue} times ${comparisonSign} than the past day`);
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
