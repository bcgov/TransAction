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

import '../scss/transaction.scss';

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
                <Route path="/event" exact component={EventList} />
                <Route path="/event/:id" exact component={EventPage} />
                <Route path="/profile/" exact component={Profile} />
                <Route path="/profile/:id" exact component={Profile} />
                <Route path="/team/" exact component={Team} />
                <Route path="/team/:id" exact component={Team} />
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
