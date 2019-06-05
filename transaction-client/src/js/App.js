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
// import FreeAgentsList from './components/FreeAgentsList';
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
                <Route path="/" exact component={Home} />
                <Route path={Constants.PATHS.EVENT} exact component={EventList} />
                <Route path={`${Constants.PATHS.EVENT}/:id`} exact component={EventDetail} />
                <Route path={Constants.PATHS.PROFILE} exact component={Profile} />
                <Route path={`${Constants.PATHS.PROFILE}/:id`} exact component={Profile} />
                <Route path={Constants.PATHS.TEAM} exact component={TeamsList} />
                <Route path={`${Constants.PATHS.TEAM}/:id`} exact component={TeamDetail} />
                <Route path={Constants.PATHS.START} exact component={GettingStarted} />
                {/* <Route path="/free_agents" exact component={FreeAgentsList} /> */}
                <Route path={Constants.PATHS.INCENTIVES} exact component={Incentives} />
                <Route path={Constants.PATHS.FAQ} exact component={FAQ} />
                <Route path={Constants.PATHS.MESSAGES} exact component={MessageBoard} />
                <Route path={`${Constants.PATHS.MESSAGES}/:id`} exact component={MessageBoardTopicDetail} />
                <Route path={Constants.PATHS.ADMIN} exact component={Admin} />
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
