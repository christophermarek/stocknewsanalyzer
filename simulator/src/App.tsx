import * as React from "react";
import './App.css';
import News from "./news/News";
import Default from "./Default";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from "react-router-dom";

function App() {
  
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
