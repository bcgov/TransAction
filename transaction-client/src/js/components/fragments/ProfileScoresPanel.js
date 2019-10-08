import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Alert } from 'reactstrap';

import { fetchAllUserScores, fetchAllTeamScores } from '../../actions';
import PageSpinner from '../ui/PageSpinner';
import UserScoreCard from './UserScoreCard';

import * as Constants from '../../Constants';

class ProfileScoresPanel extends React.Component {
  state = { loading: true, logActivityEventId: null, cancelTokenSource: undefined };

  componentDidMount() {
    this.setState({ loading: true });

    const { fetchAllUserScores, fetchAllTeamScores, currentUser } = this.props;

    if (currentUser.teamId) {
      Promise.all([fetchAllUserScores(currentUser.id), fetchAllTeamScores(currentUser.teamId)]).then(() => {
        this.setState({ loading: false });
      });
    } else {
      this.setState({ loading: false });
    }
  }

  renderUserScores() {
    const { userIdToDisplay, teamIdToDisplay, scores, currentUser } = this.props;

    const combinedScores = [];
    const userScores = scores.user[userIdToDisplay];
    const teamScores = scores.team[teamIdToDisplay];

    if (userScores) {
      Object.values(userScores).forEach(score => {
        combinedScores[score.eventId] = {
          ...combinedScores[score.eventId],
          userScore: score.score,
          event: { name: score.eventName, eventId: score.eventId },
        };
      });
    }

    if (teamScores) {
      Object.values(teamScores).forEach(score => {
        combinedScores[score.eventId] = {
          ...combinedScores[score.eventId],
          teamScore: score.score,
          event: { name: score.eventName, id: score.eventId },
        };
      });
    }

    const userScoreCards = [];

    Object.keys(combinedScores).forEach(key => {
      userScoreCards.push(
        <Col xs="12" lg="6" key={key} className="mb-3">
          <UserScoreCard
            score={combinedScores[key].userScore}
            teamScore={combinedScores[key].teamScore}
            event={combinedScores[key].event}
            cardWidth={Constants.USER_SCORE_CARD_WIDTH.NARROW}
            showLogButton={false}
          />
        </Col>
      );
    });

    return (
      <Row>
        {userScoreCards.length > 0 ? (
          userScoreCards
        ) : (
          <Col>
            <Alert color="warning">
              {currentUser.teamId ? (
                <React.Fragment>
                  You have not participated in any events yet. Please head to the{' '}
                  <Link to={Constants.PATHS.EVENT}>Events</Link> page to participate in an event.
                </React.Fragment>
              ) : (
                <React.Fragment>
                  You are not currently on a team. Get started <Link to={Constants.PATHS.START}>here</Link>.
                </React.Fragment>
              )}
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
            <h4>Activity Summary</h4>
          </Col>
        </Row>
        {this.renderUserScores()}
      </React.Fragment>
    );
  }

  render() {
    return this.state.loading ? <PageSpinner /> : <React.Fragment>{this.renderContent()}</React.Fragment>;
  }
}

const mapStateToProps = state => {
  return {
    scores: state.scores,
    currentUser: state.users.all[state.users.current.id],
  };
};

export default connect(
  mapStateToProps,
  { fetchAllUserScores, fetchAllTeamScores }
)(ProfileScoresPanel);
