import React, { useEffect, useState } from "react";

import { getCurrentData, getCurrentPrice, getHistoricalPrices } from '../API'
import Chart from 'kaktana-react-lightweight-charts'
import { render } from "@testing-library/react";

type Props = simulatorProps

 

const Simulator: React.FC<Props> = (  ) => {

    const [ticker, setTicker] = useState<string>('');
    const [market, setMarket] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [cash, setCash] = useState<string>('');
    const [simulateBtnText, setSimulateBtnText] = useState<string>('Simulate');
    const [formDisabled, setFormDisabled] = useState<boolean>(false);
    const [historicalPrices, setHistoricalPrices] = useState<Array<yahooStockHistoricalPrices>>([]);
    const [fixedHistoricalPrices, setFixedHistoricalPrices] = useState<Array<yahooStockHistoricalPrices>>([]);
    const [historicalPricesFixed, setHistoricalPricesFixed] = useState<boolean>(false);

  
    

    const fetchHistoricalPrices = (_startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
        getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, _ticker, _frequency)
        .then(({ data: { historicalPrices } }: any) => setHistoricalPrices(historicalPrices))
        .catch((err: Error) => console.log(err))
    }

    function simulateClicked(){

        //set simulate text to reset
        if(simulateBtnText == 'Simulate'){
            setSimulateBtnText('Reset');

            setTicker("AAPL")
            setMarket("AAPL")
            setDate("0,6,2020")
            setTime("00")
            setCash("000")

            let failed = false;
            let failedText = "No text entered";

            //simulate logic
            //first check all forms are filled and not blank
            if(ticker == ''){
                failed = true;
                failedText = "No ticker entered";
            }
            if(market == ''){
                failed = true;
                failedText = "No market entered";
            }
            if(date == ''){
                failed = true;
                failedText = "No date entered";
            }
            if(time == ''){
                failed = true;
                failedText = "No time entered";
            }
            if(cash == ''){
                failed = true;
                failedText = "No cash entered";
            }
          

            //check if validation passed, if it didnt then cancel simulation
            if(failed == true){
                setSimulateBtnText("Simulate");
                setFormDisabled(false);
                alert(failedText);
                return;
            }

            //lock form
            setFormDisabled(true);
            
            //for now date is just gonna be a split string delimited by , -> month, day, year
            let dateSplit = date.split(",");

            let today = new Date();

            //test data
            //date: 0,6,2020 ticker:AAPL, 
            //dont forget about frequency parameter, add to form

            //stores to a state
            fetchHistoricalPrices(dateSplit[0], dateSplit[1], dateSplit[2], `${today.getMonth()+1}`, `${today.getDate()}`, `${today.getFullYear()}`, ticker, "1d");
            
        }else{
            //reset logic
            setSimulateBtnText('Simulate');
            //reset form
            setTicker('');
            setMarket('');
            setDate('');
            setTime('');
            setCash('');
            setHistoricalPrices([]);
            setFormDisabled(false);
        }
    }


    //parses the historical prices state when its not empty, ie after a valid input has been entered
    function fixHistoricalPrices(){        

        let tempHistoricalPrices: Array<yahooStockHistoricalPrices> = [];

        //so the dates are inthe wrong order, sorting it is probably inneficient but we can just reverse it since we are already iterating over it.
        //can probably do this counter better, dont think I need a var but its just quick and easy
        let counter = 0;
        for(let i = historicalPrices.length - 1; i > 0; i--){
            tempHistoricalPrices[counter] = historicalPrices[i];
            //console.log(counter);
            //let newDate = new Date(Number(tempHistoricalPrices[counter].date) * 1000).toUTCString();
            //console.log(tempHistoricalPrices[counter].date + " To: " + newDate + " at counter: " + counter);
            //tempHistoricalPrices[counter].date = newDate;
            //console.log(tempHistoricalPrices[counter], newDate);
            //console.log(tempHistoricalPrices[counter].date);
            //so there is something wrong with this date thing.

            //we want to also remove the dividend entries from the graph I think, can save them for the future if we can ever add them to the graph view
            counter++;
        }

        //console.log(Array.isArray(tempHistoricalPrices));
        //console.log(tempHistoricalPrices);
        //console.log(tempHistoricalPrices[0]);
        //console.log(tempHistoricalPrices[tempHistoricalPrices.length - 1])
        //console.log(tempHistoricalPrices);
        setFixedHistoricalPrices(tempHistoricalPrices);
        
    }

    function renderChart(){
        console.log("called");

        //console.log(fixedHistoricalPrices[0])
        /*
        for(let i = 0; i < fixedHistoricalPrices.length; i++){
            console.log(fixedHistoricalPrices[i]);
        }
        console.log(fixedHistoricalPrices);
        */
        let options:object = {
            alignLabels: true,
            timeScale: {
              rightOffset: 12,
              barSpacing: 3,
              fixLeftEdge: true,
              lockVisibleTimeRangeOnResize: true,
              rightBarStaysOnScroll: true,
              borderVisible: false,
              borderColor: "#fff000",
              visible: true,
              timeVisible: true,
              secondsVisible: false
            }
        }
        let graphData:any = [{
            data: [
                { time: '2018-10-19', open: 180.34, high: 180.99, low: 178.57, close: 179.85 },
                { time: '2018-10-22', open: 180.82, high: 181.40, low: 177.56, close: 178.75 },
                { time: '2018-10-23', open: 175.77, high: 179.49, low: 175.44, close: 178.53 },
                { time: '2018-10-24', open: 178.58, high: 182.37, low: 176.31, close: 176.97 },
                { time: '2018-10-25', open: 177.52, high: 180.50, low: 176.83, close: 179.07 },
                { time: '2018-10-26', open: 176.88, high: 177.34, low: 170.91, close: 172.23 },
                { time: '2018-10-29', open: 173.74, high: 175.99, low: 170.95, close: 173.20 },
                { time: '2018-10-30', open: 173.16, high: 176.43, low: 172.64, close: 176.24 },
                { time: '2018-10-31', open: 177.98, high: 178.85, low: 175.59, close: 175.88 },
                { time: '2018-11-01', open: 176.84, high: 180.86, low: 175.90, close: 180.46 },
                { time: '2018-11-02', open: 182.47, high: 183.01, low: 177.39, close: 179.93 },
                { time: '2018-11-05', open: 181.02, high: 182.41, low: 179.30, close: 182.19 }
            ] 
        }]

        console.log(graphData);
        return(
            <>
                <p>hi</p>
                <Chart options={options} areaSeries={graphData} autoWidth height={320} />
            </>
        )
        
        
    }

    if(historicalPrices.length > 0 && historicalPricesFixed == false){
        setHistoricalPricesFixed(true);
        fixHistoricalPrices();
    }

    /*
    if(fixedHistoricalPrices.length > 0){
        renderChart();
    }
    */

    return (
        <div className="Simulator">
            <p>Simulate Purchase at time</p>
            <div className="formField">
                <p className="formFieldLabel">Ticker: </p>
                <input type="text" disabled={formDisabled} value={ticker} onChange={(ev: React.ChangeEvent<HTMLInputElement>,): void => setTicker(ev.target.value)} />
            </div>
            <div className="formField">
                <p className="formFieldLabel">Market: </p>
                <input type="text" disabled={formDisabled} value={market} onChange={(ev: React.ChangeEvent<HTMLInputElement>,): void => setMarket(ev.target.value)} />
            </div>
            <div className="formField">
                <p className="formFieldLabel">Date: </p>
                <input type="text" disabled={formDisabled} value={date} onChange={(ev: React.ChangeEvent<HTMLInputElement>,): void => setDate(ev.target.value)} />
            </div>
            <div className="formField">
                <p className="formFieldLabel">Time: </p>
                <input type="text" disabled={formDisabled} value={time} onChange={(ev: React.ChangeEvent<HTMLInputElement>,): void => setTime(ev.target.value)} />
            </div>
            <div className="formField">
                <p className="formFieldLabel">Cash: </p>
                <input type="string" disabled={formDisabled} value={cash} onChange={(ev: React.ChangeEvent<HTMLInputElement>,): void => setCash(ev.target.value)} />
            </div>

            <input type="button" onClick={simulateClicked} value={simulateBtnText}/>

            {fixedHistoricalPrices.length > 0 &&
                renderChart()
            }
        </div>
    )
}


export default Simulator;
