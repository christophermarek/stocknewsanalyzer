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
    const [fixedHistoricalPrices, setFixedHistoricalPrices] = useState<Array<areaSeriesType>>([]);
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

        let tempHistoricalPrices: Array<areaSeriesType> = [];

        //so the dates are inthe wrong order, sorting it is probably inneficient but we can just reverse it since we are already iterating over it.
        //can probably do this counter better, dont think I need a var but its just quick and easy
        let counter = 0;
        for(let i = historicalPrices.length - 1; i > 0; i--){

            //for area series graph we only want the values time and value inside our object
            //the open and close are good for candle graphs. 
            let object = {time: historicalPrices[i].date, value: Number(historicalPrices[i].close)}
            tempHistoricalPrices[counter] = object;
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
        */
        console.log(fixedHistoricalPrices);
        
        let options:object = {
            topColor: 'rgba(21, 146, 230, 0.4)',
            bottomColor: 'rgba(21, 146, 230, 0)',
            lineColor: 'rgba(21, 146, 230, 1)',
            lineStyle: 0,
            lineWidth: 3,
            crosshairMarkerVisible: false,
            crosshairMarkerRadius: 3,
            crosshairMarkerBorderColor: 'rgb(255, 255, 255, 1)',
            crosshairMarkerBackgroundColor: 'rgb(34, 150, 243, 1)',
        }
        let areaSeries:any = [{
            data: fixedHistoricalPrices
        }]
        
        return(
            <>
                <p>hi</p>
                <Chart options={options} areaSeries={areaSeries} autoWidth height={500} />
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
