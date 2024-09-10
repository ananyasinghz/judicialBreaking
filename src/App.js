import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import BondAI from './components/BondAI';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/profile" component={Profile} />
            <Route path="/bond-ai" component={BondAI} />
          </Switch>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;