import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import Footer from './fragments/Footer';
import Header from './fragments/Header';
import history from './history';
import Main from './components/Main';
import Profile from './components/Profile';

import '../scss/transaction.scss';

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <React.Fragment>
          <Header />
          <Container>
            <Switch>
              <Route path="/" exact component={Main} />
              <Route path="/Profile" exact component={Profile} />
            </Switch>
          </Container>
          <Footer />
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
