import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Alert } from 'reactstrap';

import { fetchAllUserScores, fetchAllTeamScores, fetchEvents } from '../../actions';
import PageSpinner from '../ui/PageSpinner';
import UserScoreCard from './UserScoreCard';
import LogActivityForm from '../forms/LogActivityForm';

import * as Constants from '../../Constants';
import * as utils from '../../utils';

class ProfileScoresPanel extends React.Component {
  state = { loading: true, showLogActivityForm: false, logActivityEventId: null };

  componentDidMount() {
    this.setState({ loading: true });

    const { fetchAllUserScores, fetchAllTeamScores, fetchEvents, currentUser } = this.props;
    const actionPromises = [
      utils.buildActionWithParam(fetchAllUserScores, currentUser.id),
      utils.buildActionWithParam(fetchEvents),
    ];

    if (currentUser.teamId) {
      actionPromises.push(utils.buildActionWithParam(fetchAllTeamScores, currentUser.teamId));
    }

    Promise.all(
      actionPromises.map(promise => {
        return promise.action(promise.param);
      })
    ).then(() => {
      this.setState({ loading: false });
    });
  }

  showLogActivityForm = eventId => {
    this.setState({ showLogActivityForm: true, logActivityEventId: eventId });
  };

  toggleLogActivityForm = () => {
    this.setState(prevState => ({
      showLogActivityForm: !prevState.showLogActivityForm,
    }));
  };

  renderUserScores() {
    const { events, userIdToDisplay, teamIdToDisplay, scores } = this.props;

    const userScores = Object.values(scores.user[userIdToDisplay]).map(score => {
      const teamScore = scores.team[teamIdToDisplay][score.eventId];

      return (
        <Col xs="12" lg="6" key={score.eventId} className="mb-3">
          <UserScoreCard
            score={score}
            teamScore={teamScore}
            event={events[score.eventId]}
            cardWidth={Constants.USER_SCORE_CARD_WIDTH.NARROW}
            showLogActivityForm={this.showLogActivityForm}
          />
        </Col>
      );
    });

    return (
      <Row className="mb-5">
        {userScores.length > 0 ? (
          userScores
        ) : (
          <Col>
            <Alert color="warning">
              You have not participated in any events yet. Get started <Link to={Constants.PATHS.START}>here</Link>.
            </Alert>
          </Col>
        )}
      </Row>
    );
  }

  renderContent() {
    return (
      <React.Fragment>
        <Row className="mb-3">
          <Col>
            <h4>Activity</h4>
          </Col>
        </Row>
        {this.renderUserScores()}
      </React.Fragment>
    );
  }

  render() {
    return this.state.loading ? (
      <PageSpinner />
    ) : (
      <React.Fragment>
        {this.renderContent()}
        <LogActivityForm
          isOpen={this.state.showLogActivityForm}
          toggle={this.toggleLogActivityForm}
          eventId={this.state.logActivityEventId}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    scores: state.scores,
    currentUser: state.users.current,
    events: state.events,
  };
};

export default connect(
  mapStateToProps,
  { fetchAllUserScores, fetchAllTeamScores, fetchEvents }
)(ProfileScoresPanel);
