import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import ProviderTest from "./pages/test/providerTest";
import Landing from "./pages/landing/Landing";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route path="/test">
          <ProviderTest />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
