import React, { useEffect, useState } from "react";
import './App.css';
import News from "./news/News";
import Default from "./Default";
import FrequencyCharts from "./simulator/FrequencyCharts";
import Simulator from "./simulator/Simulator";
import RealTimeData from "./realtimedata/RealTimeData";
import ReactGA from 'react-ga';
import { getBnnMarketCalls, getCurrentData, getCurrentPrice, getHistoricalPrices, getRealTimeCrypto, getRealTimeWsb  } from './API'

import './news.css'

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from "react-router-dom";

function App() {

  const [realtimeCrypto, setRealTimeCrypto] = useState<any>();
  const [realtimeWsb, setRealTimeWsb] = useState<any>();
  const [bnnmarketcalls, setBnnMarketCalls] = useState<bnnmarketcall[]>([]);
  const [selectedNavItem, setSelectedNavItem] = useState<string>("none");

  if (process.env.REACT_APP_GA != undefined) {
    ReactGA.initialize(process.env.REACT_APP_GA);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }


  useEffect(() => {
    fetchBnnMarketCallData()

    async function loadFromServerIntoState() {
      if (realtimeCrypto == undefined) {
        console.log("getting realtime crypto")
        let data = await getRealTimeCrypto()
        setRealTimeCrypto(data.data.realtimeList);
      }
      if (realtimeWsb == undefined) {
        console.log("getting realtime wsb")
        let data = await getRealTimeWsb()
        setRealTimeWsb(data.data.realtimeList);
      }
    }
    loadFromServerIntoState()

    const pathname = window.location.pathname
    switch (pathname.toString().toLowerCase()) {
      case '/':
        setSelectedNavItem('home');
        break;
      case '/simulator':
        setSelectedNavItem('simulator');
        break;
      case '/news':
        setSelectedNavItem('news');
        break;
      case '/realtimedata':
        setSelectedNavItem('realtimedata');
        break;
      case '/frequencycharts':
        setSelectedNavItem('frequencycharts');
        break;
    }

  }, [])

  const fetchBnnMarketCallData = (): void => {
    getBnnMarketCalls()
      .then(({ data: { bnnmarketcallData } }: bnnmarketcall[] | any) => setBnnMarketCalls(bnnmarketcallData))
      .catch((err: Error) => console.log(err))
  }

  const navBtnClicked = (navItem: string): void => {
    setSelectedNavItem(navItem)
    ReactGA.pageview(navItem);
  }

  return (
    <div className="App">
      <Router>
        <div>

          <nav className="navBar">
            <Link className={"navBtn" + (selectedNavItem == "home" ? (" navItemSelected") : (""))} onClick={() => navBtnClicked("home")} to="/">Market Overview</Link>
            <Link className={"navBtn" + (selectedNavItem == "realtimedata" ? (" navItemSelected") : (""))} onClick={() => navBtnClicked("realtimedata")} to="/realtimedata">Real Time</Link>
            <Link className={"navBtn" + (selectedNavItem == "frequencycharts" ? (" navItemSelected") : (""))} onClick={() => navBtnClicked("frequencycharts")} to="/frequencycharts">Frequency Charts</Link>
          </nav>

          <Switch>
            <Route path="/news">
              <News bnnmarketcallObject={bnnmarketcalls} />
            </Route>
            <Route path="/simulator">
              <Simulator />
            </Route>
            <Route path="/frequencycharts">
              <FrequencyCharts />
            </Route>
            <Route path="/realtimedata">
              <RealTimeData realtimeCrypto={realtimeCrypto} realtimeWsb={realtimeWsb} />
            </Route>
            <Route path="/">
              <Default />
            </Route>


          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
