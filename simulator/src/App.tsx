import React, { useEffect, useState } from "react";
import './App.css';
import News from "./news/News";
import Default from "./Default";
import FrequencyCharts from "./simulator/FrequencyCharts";
import Simulator from "./simulator/Simulator";

import { getBnnMarketCalls, getCurrentData, getCurrentPrice, getHistoricalPrices } from './API'

import './news.css'

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from "react-router-dom";

function App() {
  
  const [bnnmarketcalls, setBnnMarketCalls] = useState<bnnmarketcall[]>([]);
  const [selectedNavItem, setSelectedNavItem] = useState<string>("none");

  useEffect(() => {
    fetchTodos()

    const pathname = window.location.pathname
    switch(pathname.toString().toLowerCase()){
      case '/':
        setSelectedNavItem('home');
        break;
      case '/simulator':
        setSelectedNavItem('simulator');
        break;
      case '/news':
        setSelectedNavItem('news');
        break;
      case 'frequencycharts':
        setSelectedNavItem('frequencycharts');
      break;
    }

  }, [])

  const fetchTodos = (): void => {
    getBnnMarketCalls()
    .then(({ data: { bnnmarketcallData } }: bnnmarketcall[] | any) => setBnnMarketCalls(bnnmarketcallData))
    .catch((err: Error) => console.log(err))
  }
  
  const navBtnClicked = (navItem: string): void => {
    setSelectedNavItem(navItem)
  }

  return (
    <div className="App">
      <Router>
        <div>

          <nav className="navBar">
            <Link className={"navBtn" + (selectedNavItem == "home" ? (" navItemSelected") : (""))} onClick={() => navBtnClicked("home")} to="/">Home</Link>
            <Link className={"navBtn" + (selectedNavItem == "news" ? (" navItemSelected") : (""))} onClick={() => navBtnClicked("news")} to="/news">News</Link>
            <Link className={"navBtn" + (selectedNavItem == "simulator" ? (" navItemSelected") : (""))} onClick={() => navBtnClicked("simulator")} to="/simulator">Simulator</Link>
            <Link className={"navBtn" + (selectedNavItem == "frequencycharts" ? (" navItemSelected") : (""))} onClick={() => navBtnClicked("frequencycharts")} to="/frequencycharts">Frequency Charts</Link>
          </nav>

          <Switch>
            <Route path="/news">
              <News bnnmarketcallObject={ bnnmarketcalls }/>
            </Route>
            <Route path="/simulator">
              <Simulator />
            </Route>
            <Route path="/frequencycharts">
                <FrequencyCharts />
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
