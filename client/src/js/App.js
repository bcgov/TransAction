import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import history from './history';
import Footer from './components/fragments/Footer';
import Header from './components/fragments/Header';
import Home from './components/Home';
import Main from './components/Main';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import Profile from './components/Profile';
import TeamDetail from './components/TeamDetail';
import TeamsList from './components/TeamsList';
import GettingStarted from './components/GettingStarted';
import FreeAgentsList from './components/FreeAgentsList';
import Incentives from './components/Incentives';
import MessageBoard from './components/MessageBoard';
import MessageBoardTopicDetail from './components/MessageBoardTopicDetail';
import Admin from './components/Admin';
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
              {/* For each Route, I've replaced component={ComponentName} with render={() => <ComponentName />} because React Router expects the component
               prop to be a function, and passing it as render={() => <Component />} is a good way to handle this issue. */}
                <Route path="/" exact render={() => <Home />} />
                <Route path={Constants.PATHS.EVENT} exact render={() => <EventList />} />
                <Route path={`${Constants.PATHS.EVENT}/:id`} exact render={() => <EventDetail />} />
                <Route path={Constants.PATHS.PROFILE} exact render={() => <Profile />} />
                <Route path={`${Constants.PATHS.PROFILE}/:id`} exact render={() => <Profile />} />
                <Route path={Constants.PATHS.TEAM} exact render={() => <TeamsList />} />
                <Route path={`${Constants.PATHS.TEAM}/:id`} exact render={() => <TeamDetail />} />
                <Route path={Constants.PATHS.START} exact render={() => <GettingStarted />} />
                <Route path={Constants.PATHS.FREE_AGENTS} exact render={() => <FreeAgentsList />} />
                <Route path={Constants.PATHS.INCENTIVES} exact render={() => <Incentives />} />
                <Route path={Constants.PATHS.FAQ} exact render={() => <FAQ />} />
                <Route path={Constants.PATHS.MESSAGES} exact render={() => <MessageBoard />} />
                <Route path={`${Constants.PATHS.MESSAGES}/:id`} exact render={() => <MessageBoardTopicDetail />} />
                <Route path={Constants.PATHS.ADMIN} exact render={() => <Admin />} />
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
