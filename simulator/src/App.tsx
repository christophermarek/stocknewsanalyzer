import React, { useEffect, useState } from "react";
import './App.css';
import News from "./news/News";
import Default from "./Default";
import { getTodos } from './API'

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from "react-router-dom";

function App() {
  
  const [todos, setTodos] = useState<bnnmarketcall[]>([])

  useEffect(() => {
    console.log(fetchTodos())
    //console.log(todos);
  }, [])

  const fetchTodos = (): void => {
    getTodos()
    .then(({ data: { todos } }: bnnmarketcall[] | any) => setTodos(todos))
    .catch((err: Error) => console.log(err))
  }

  return (
    <div className="App">
      <Router>
        <div>

          <nav className="navBar">
            <Link to="/">Home</Link>
            <Link to="/news">News</Link>
          </nav>

          <Switch>
            <Route path="/news">
              <News />
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
