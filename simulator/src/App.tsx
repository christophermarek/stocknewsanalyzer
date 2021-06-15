import React, { useEffect, useState } from "react";
import './App.css';
import News from "./news/News";
import Default from "./Default";
import FrequencyCharts from "./simulator/FrequencyCharts";
import Simulator from "./simulator/Simulator";
import RealTimeData from "./realtimedata/RealTimeData";
import ReactGA from 'react-ga';
import { getBnnMarketCalls, getHistoricalPrices, getRealTimeCrypto, getRealTimeWsb } from './API'
import CoinGecko from 'coingecko-api';

import './news.css'

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from "react-router-dom";

function App() {

  //ok i can see why redux could be useful instead of this mess
  const [realtimeCrypto, setRealTimeCrypto] = useState<any>();
  const [realtimeWsb, setRealTimeWsb] = useState<any>();
  const [bnnmarketcalls, setBnnMarketCalls] = useState<bnnmarketcall[]>([]);
  const [selectedNavItem, setSelectedNavItem] = useState<string>("none");
  const [snp500, setSnp500] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [tsxsnp, setTsxsnp] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [nasdaq, setNasdaq] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [cadUsd, setcadUsd] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [oil, setOil] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [btc, setBtc] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [eth, setEth] = useState<Array<yahooStockHistoricalPrices>>([]);
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  if (process.env.REACT_APP_GA !== undefined) {
    ReactGA.initialize(process.env.REACT_APP_GA);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }


  useEffect(() => {
    const CoinGeckoClient: any = new CoinGecko();


    fetchBnnMarketCallData()

    async function loadFromServerIntoState() {
      if (realtimeCrypto === undefined) {
        let data = await getRealTimeCrypto()
        setRealTimeCrypto(data.data.realtimeList);
      }
      if (realtimeWsb === undefined) {
        let data = await getRealTimeWsb()
        setRealTimeWsb(data.data.realtimeList);
      }

      //load default page
      const fetchSummary = (name: string, _startMonth: string, _startDay: string, _startYear: string, _endMonth: string, _endDay: string, _endYear: string, _ticker: string, _frequency: string): void => {
        //to try and stop too many api calls by accident
        if (!dataFetched) {
          //TSX
          getHistoricalPrices(_startMonth, _startDay, _startYear, _endMonth, _endDay, _endYear, name, _frequency)
            .then(({ data: { historicalPrices } }: any) => setSummary(name, historicalPrices))
            .catch((err: Error) => console.log(err))
        }
      }

      const setSummary = (name: string, data: yahooStockHistoricalPrices[]) => {
        switch (name) {
          case 'CL=F':
            setOil(data);
            break;
          case 'CADUSD=X':
            setcadUsd(data);
            break;
          case '^IXIC':
            setNasdaq(data);
            break;
          case '^GSPTSE':
            setTsxsnp(data);
            break;
          case '^GSPC':
            setSnp500(data);
            break;
        }

      }
      let fetchCryptoPrices = async () => {
        let today = new Date();
        let yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);



        let btcData = await CoinGeckoClient.coins.fetchMarketChart('bitcoin', {
          days: 1,
          interval: 'daily',
          vs_currency: 'usd',
        });

        let etherData = await CoinGeckoClient.coins.fetchMarketChart('ethereum', {
          days: 1,
          interval: 'daily',
          vs_currency: 'usd',
        });


        setBtc(btcData.data);
        setEth(etherData.data);
        setDataFetched(true);
      };

      //to calculate daily percent change we just need to fetch the price from yesterday, today
      if ((snp500.length < 1 && dataFetched === false)) {
        let today = new Date();
        let yesterday = new Date();
        // subtract one day from current time                          
        yesterday.setDate(yesterday.getDate() - 1);

        let tickersToFetch = ['CL=F', 'CADUSD=X', '^IXIC', '^GSPTSE', '^GSPC']
        let size = tickersToFetch.length;
        for (let i = 0; i < size; i++) {
          fetchSummary(tickersToFetch[i], `${yesterday.getMonth()}`, `${yesterday.getDate()}`, `${yesterday.getFullYear()}`, `${today.getMonth()}`, `${today.getDate() + 1}`, `${today.getFullYear()}`, 'none', '1d')
        }

        //fetch crypto
        fetchCryptoPrices();

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

  }, [dataFetched, realtimeCrypto, realtimeWsb, snp500.length])

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
            <Link className={"navBtn" + (selectedNavItem === "home" ? (" navItemSelected") : (""))} onClick={() => navBtnClicked("home")} to="/">Market Overview</Link>
            <Link className={"navBtn" + (selectedNavItem === "realtimedata" ? (" navItemSelected") : (""))} onClick={() => navBtnClicked("realtimedata")} to="/realtimedata">Real Time</Link>
            <Link className={"navBtn" + (selectedNavItem === "frequencycharts" ? (" navItemSelected") : (""))} onClick={() => navBtnClicked("frequencycharts")} to="/frequencycharts">Frequency Charts</Link>
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
              <Default
                snp500={snp500}
                tsxsnp={tsxsnp}
                nasdaq={nasdaq}
                cadUsd={cadUsd}
                oil={oil}
                btc={btc}
                eth={eth}
                dataFetched={dataFetched}
              />
            </Route>


          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
