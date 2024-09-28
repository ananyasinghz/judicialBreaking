import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import BondAI from './components/BondAI';
import JudicialLogin from './components/judicial-dashboard';
import CaseAssignment from './components/case-assignment-component';
import calendar from './components/court-calendar';
import records from './components/defendant-records';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/signup" component={Signup} />
            <Route path="/profile" component={Profile} />
            <Route path="/bond-ai" component={BondAI} />
            <Route path="/judicial-login" component={JudicialLogin} />
            <Route path="/case-assignment" component={CaseAssignment} />
            <Route path="/court-calendar" component={calendar} />
            <Route path="/defendant-records" component={records} />
          </Switch>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;