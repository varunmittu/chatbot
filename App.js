import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={ChatInterface} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
