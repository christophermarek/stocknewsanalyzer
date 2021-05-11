import React, { useEffect, useState } from "react";
import './App.css';
import News from "./news/News";
import Default from "./Default";
import { getTodos } from './API'

import './news.css'

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from "react-router-dom";

function App() {
  
  const [todos, setTodos] = useState<bnnmarketcall[]>([]);
  const [selectedNavItem, setSelectedNavItem] = useState<string>("none");

  useEffect(() => {
    fetchTodos()
    //console.log(todos);
  }, [])

  const fetchTodos = (): void => {
    getTodos()
    .then(({ data: { bnnmarketcallData } }: bnnmarketcall[] | any) => setTodos(bnnmarketcallData))
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
          </nav>

          <Switch>
            <Route path="/news">
              <News bnnmarketcallObject={ todos }/>
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
