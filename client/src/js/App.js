import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'reactstrap';

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

const App = () => {
  
  return (
    <Main>
      <Router>
        <>
          <Header />
          <Container>
            <Routes>
              {/* In React Router v6, we use the `element` prop to render components */}
              <Route path="/" element={<Home />} />
              <Route path={Constants.PATHS.EVENT} element={<EventList />} />
              <Route path={`${Constants.PATHS.EVENT}/:id`} element={<EventDetail />} />
              <Route path={Constants.PATHS.PROFILE} element={<Profile />} />
              <Route path={`${Constants.PATHS.PROFILE}/:id`} element={<Profile />} />
              <Route path={Constants.PATHS.TEAM} element={<TeamsList />} />
              <Route path={`${Constants.PATHS.TEAM}/:id`} element={<TeamDetail />} />
              <Route path={Constants.PATHS.START} element={<GettingStarted />} />
              <Route path={Constants.PATHS.FREE_AGENTS} element={<FreeAgentsList />} />
              <Route path={Constants.PATHS.INCENTIVES} element={<Incentives />} />
              <Route path={Constants.PATHS.FAQ} element={<FAQ />} />
              <Route path={Constants.PATHS.MESSAGES} element={<MessageBoard />} />
              <Route path={`${Constants.PATHS.MESSAGES}/:id`} element={<MessageBoardTopicDetail />} />
              <Route path={Constants.PATHS.ADMIN} element={<Admin />} />
            </Routes>
          </Container>
          <Footer />
        </>
      </Router>
    </Main>
  );
};

export default App;
