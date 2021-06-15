import React, { useState } from "react";
import { getHistoricalPrices } from '../API'
import Chart from 'kaktana-react-lightweight-charts'

type Props = simulatorProps

const Simulator: React.FC<Props> = (  ) => {

    const [ticker, setTicker] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [cash, setCash] = useState<string>('');
    const [simulateBtnText, setSimulateBtnText] = useState<string>('Simulate');
    const [formDisabled, setFormDisabled] = useState<boolean>(false);
    const [historicalPrices, setHistoricalPrices] = useState<Array<yahooStockHistoricalPrices>>([]);
    const [fixedHistoricalPrices, setFixedHistoricalPrices] = useState<Array<areaSeriesType>>([]);
    const [historicalPricesFixed, setHistoricalPricesFixed] = useState<boolean>(false);

    const fetchHistoricalPrices = (_startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
        getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, _ticker, _frequency)
        .then(({ data: { historicalPrices } }: any) => setHistoricalPrices(historicalPrices))
        .catch((err: Error) => console.log(err))
    }

    function loadSimulationPreset(){
        setTicker("AAPL")
        setDate("2017-06-01")
        setCash("10000")
    }

    function simulateClicked(){

        //set simulate text to reset
        if(simulateBtnText === 'Simulate'){
            setSimulateBtnText('Reset');

            let failed = false;
            let failedText = "No text entered";
            if(ticker === ''){
                failed = true;
                failedText = "No ticker entered";
            }
            if(date === ''){
                failed = true;
                failedText = "No date entered";
            }
            if(cash === ''){
                failed = true;
                failedText = "No cash entered";
            }
          
            //check if validation passed, if it didnt then cancel simulation
            if(failed === true){
                setSimulateBtnText("Simulate");
                setFormDisabled(false);
                alert(failedText);
                return;
            }

            //lock form
            setFormDisabled(true);
            
            //for now date is just gonna be a split string delimited by , -> month, day, year
            let dateSplit = date.split("-");

            let today = new Date();

            //test data
            //frequency is part of the yahoo stock prices, its 1d, i forget the other options

            //stores to a state
            fetchHistoricalPrices(dateSplit[2], dateSplit[1], dateSplit[0], `${today.getMonth()+1}`, `${today.getDate()}`, `${today.getFullYear()}`, ticker, "1d");
            
        }else{
            //reset logic
            setSimulateBtnText('Simulate');
            //reset form
            setTicker('');
            setDate('');
            setCash('');
            setHistoricalPrices([]);
            setFormDisabled(false);
            setFixedHistoricalPrices([]);
            setHistoricalPricesFixed(false);
        }
    }


    //parses the historical prices state when its not empty, ie after a valid input has been entered
    function fixHistoricalPrices(){        
        let tempHistoricalPrices: Array<areaSeriesType> = [];
        //so the dates are inthe wrong order, sorting it is probably inneficient but we can just reverse it since we are already iterating over it.
        //can probably do this counter better, dont think I need a var but its just quick and easy
        let counter = 0;
        for(let i = historicalPrices.length - 1; i > 0; i--){
            //for area series graph we only want the values time and value inside our object
            //the open and close are good for candle graphs. 
            let object = {time: historicalPrices[i].date, value: Number(historicalPrices[i].close)}
            tempHistoricalPrices[counter] = object;
            counter++;
        }
        setFixedHistoricalPrices(tempHistoricalPrices);        
    }

    function renderChart(){
        
        let options:object = {
            topColor: 'rgba(21, 146, 230, 0.4)',
            bottomColor: 'rgba(21, 146, 230, 0)',
            lineColor: 'rgba(21, 146, 230, 1)',
            lineStyle: 0,
            lineWidth: 3,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 3,
            crosshairMarkerBorderColor: 'rgb(255, 255, 255, 1)',
            crosshairMarkerBackgroundColor: 'rgb(34, 150, 243, 1)',
        }
        let areaSeries:any = [{
            data: fixedHistoricalPrices
        }]

        return(
            <div className="simulationChart">
                <p>Chart for {ticker}</p>
                <Chart options={options} areaSeries={areaSeries} autoWidth height={500} />
            </div>
        )

    }

    function renderSimulationOutput(){
        
        let cashLeftover = 0;
        let totalEquity = 0;
        let sharesPurchased = 0;
        let percentGain = 0;
        let gainInDollars = 0;
        
        //calculate how many shares you can purchase at date entered.
        //this will just be the price at element 0 right
        let oldSharePrice = fixedHistoricalPrices[0].value;
        //must round down so no fractional shares
        sharesPurchased = Math.floor(Number(cash) / oldSharePrice);
        cashLeftover = Number(cash) - (sharesPurchased * oldSharePrice);

        let currentSharePrice = fixedHistoricalPrices[fixedHistoricalPrices.length - 1].value;
        totalEquity = sharesPurchased * currentSharePrice;
        
        gainInDollars = totalEquity - Number(cash);
        percentGain = ((currentSharePrice - oldSharePrice) / oldSharePrice ) * 100;
        return(
            <div className="simulationOutput">
                <p>Buy Price: {oldSharePrice.toFixed(2)}</p>
                <p>Shares Purchased: {sharesPurchased.toFixed(2)}</p>
                <p>Cash Leftover: {cashLeftover.toFixed(2)}</p>
                <p>Total Equity: {totalEquity.toFixed(2)}</p>
                <p>Percent Gain: {percentGain.toFixed(2)} %</p>
                <p>Gain In Dollars: {gainInDollars.toFixed(2)}</p>
            </div>
        )
    }

    if(historicalPrices.length > 0 && historicalPricesFixed === false){
        setHistoricalPricesFixed(true);
        fixHistoricalPrices();
    }


    return (
        <div className="Simulator">
            <div className="simulationData">
                <div className="simulationForm">
                    <p>Simulate Purchase at time</p>
                    <div className="formField">
                        <p className="formFieldLabel">Ticker: </p>
                        <input type="text" disabled={formDisabled} value={ticker} onChange={(ev: React.ChangeEvent<HTMLInputElement>,): void => setTicker(ev.target.value)} />
                    </div>
                    <div className="formField">
                        <p className="formFieldLabel">Date: </p>
                        <input type="date" disabled={formDisabled} value={date} onChange={(ev: React.ChangeEvent<HTMLInputElement>,): void => setDate(ev.target.value)} />
                    </div>
                    <div className="formField">
                        <p className="formFieldLabel">Cash: </p>
                        <input type="string" disabled={formDisabled} value={cash} onChange={(ev: React.ChangeEvent<HTMLInputElement>,): void => setCash(ev.target.value)} />
                    </div>

                    <input type="button" onClick={simulateClicked} value={simulateBtnText}/>
                    <input type="button" onClick={loadSimulationPreset} value={"Load form with preset data"} />
                </div>
                {fixedHistoricalPrices.length > 0 &&
                    renderSimulationOutput()
                }
            </div>

            {fixedHistoricalPrices.length > 0 &&
                renderChart()
            }
            
        </div>
    )
}


export default Simulator;
