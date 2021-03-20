import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import ProviderTest from "./pages/test/providerTest";
import Landing from "./pages/landing/Landing";
import Gallery from "./pages/Gallery";

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
        <Route path="/gallery/owner/:owneraddress">
          <Gallery />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
