import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import history from './history';
import Footer from './components/ui/Footer';
import Header from './components/ui/Header';
import Main from './components/Main';
import EventList from './components/EventList';
import Profile from './components/Profile';
import Team from './components/Team';
import TeamsList from './components/TeamsList';
import EventPage from './components/EventPage';
import GettingStarted from './components/GettingStarted';
import FreeAgentsList from './components/FreeAgentsList';
import Incentives from './components/Incentives';
import FAQ from './components/FAQ';

import * as Constants from './Constants';

import '../scss/transaction.scss';
import 'react-datepicker/dist/react-datepicker.css';

class App extends Component {
  render() {
    return (
      <Main>
        <Router history={history}>
          <React.Fragment>
            <Header />
            <Container>
              <Switch>
                <Route path="/" exact component={EventList} />
                <Route path={Constants.PATHS.EVENT} exact component={EventList} />
                <Route path={`${Constants.PATHS.EVENT}/:id`} exact component={EventPage} />
                <Route path={Constants.PATHS.PROFILE} exact component={Profile} />
                <Route path={`${Constants.PATHS.PROFILE}/:id`} exact component={Profile} />
                <Route path={Constants.PATHS.TEAM} exact component={Team} />
                <Route path={`${Constants.PATHS.TEAM}/:id`} exact component={Team} />
                <Route path="/teamslist" exact component={TeamsList} />
                <Route path="/getting_started" exact component={GettingStarted} />
                <Route path="/free_agents" exact component={FreeAgentsList} />
                <Route path="/incentives" exact component={Incentives} />
                <Route path="/faq" exact component={FAQ} />
              </Switch>
            </Container>
            <Footer />
          </React.Fragment>
        </Router>
      </Main>
    );
  }
}

export default App;
