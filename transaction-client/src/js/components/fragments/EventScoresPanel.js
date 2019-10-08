import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Alert } from 'reactstrap';

import { fetchUserEventScore, fetchTeamEventScore } from '../../actions';
import PageSpinner from '../ui/PageSpinner';
import UserScoreCard from './UserScoreCard';

import * as Constants from '../../Constants';

class EventScoresPanel extends React.Component {
  state = { loading: true };

  componentDidMount() {
    const { fetchUserEventScore, fetchTeamEventScore, currentUser, event } = this.props;

    if (currentUser.teamId) {
      this.setState({ loading: true });

      Promise.all([
        fetchUserEventScore(currentUser.id, event.id),
        fetchTeamEventScore(currentUser.teamId, event.id),
      ]).then(() => {
        this.setState({ loading: false });
      });
    } else this.setState({ loading: false });
  }

  renderScores() {
    const { scores, currentUser, event } = this.props;
    const score = scores.user[currentUser.id][event.id];
    const teamScore = scores.team[currentUser.teamId][event.id];

    return (
      <Row className="mt-5">
        <Col>
          <UserScoreCard
            score={score ? score.score : 0}
            teamScore={teamScore ? teamScore.score : 0}
            event={this.props.event}
            cardWidth={Constants.USER_SCORE_CARD_WIDTH.WIDE}
            refreshStandings={true}
            showLogButton={event.isActive}
            currentUser={currentUser}
          />
        </Col>
      </Row>
    );
  }

  render() {
    return this.state.loading ? (
      <PageSpinner />
    ) : (
      <React.Fragment>
        {this.props.currentUser.teamId ? (
          this.renderScores()
        ) : (
          <Row>
            <Col>
              <Alert color="warning">
                You are not currently not on a team. Click <Link to={Constants.PATHS.START}>HERE</Link> to get started!
              </Alert>
            </Col>
          </Row>
        )}
      </React.Fragment>
    );
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
  { fetchUserEventScore, fetchTeamEventScore }
)(EventScoresPanel);
