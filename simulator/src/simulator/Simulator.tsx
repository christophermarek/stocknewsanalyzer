import React, { useEffect, useState } from "react";

type Props = simulatorProps


const Simulator: React.FC<Props> = (  ) => {

    const [ticker, setTicker] = useState<string>('');
    const [market, setMarket] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [cash, setCash] = useState<string>('');
    const [simulateBtnText, setSimulateBtnText] = useState<string>('Simulate');
    const [formDisabled, setFormDisabled] = useState<boolean>(false);

    function simulateClicked(){

        //set simulate text to reset
        if(simulateBtnText == 'Simulate'){
            setSimulateBtnText('Reset');

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
            
        }else{
            //reset logic
            setSimulateBtnText('Simulate');
            //reset form
            setTicker('');
            setMarket('');
            setDate('');
            setTime('');
            setCash('');
            setFormDisabled(false);
        }
        
    }


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
        </div>
    )
}


export default Simulator;
