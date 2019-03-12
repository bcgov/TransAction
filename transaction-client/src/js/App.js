import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import Footer from './fragments/Footer';
import Header from './fragments/Header';
import history from './history';
import Main from './components/Main';
import Events from './components/Events';

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
              <Route path="/events" exact component={Events} />
            </Switch>
          </Container>
          <Footer />
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
