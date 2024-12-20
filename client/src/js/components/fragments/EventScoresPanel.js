import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Alert } from 'reactstrap';

import { fetchUserEventScore, fetchTeamEventScore } from '../../actions';
import PageSpinner from '../ui/PageSpinner';
import UserScoreCard from './UserScoreCard';

import * as Constants from '../../Constants';

const EventScoresPanel = ({ currentUser, event, scores, fetchUserEventScore, fetchTeamEventScore }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      if (currentUser.teamId) {
        setLoading(true);

        await Promise.all([
          fetchUserEventScore(currentUser.id, event.id),
          fetchTeamEventScore(currentUser.teamId, event.id),
        ]);

        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchScores();
  }, [currentUser, event, fetchUserEventScore, fetchTeamEventScore]);

  const renderScores = () => {
    const userScore = scores.user[currentUser.id]?.[event.id]?.score || 0;
    const teamScore = scores.team[currentUser.teamId]?.[event.id]?.score || 0;

    return (
      <Row className="mt-5">
        <Col>
          <UserScoreCard
            score={userScore}
            teamScore={teamScore}
            event={event}
            cardWidth={Constants.USER_SCORE_CARD_WIDTH.WIDE}
            refreshStandings={true}
            showLogButton={event.isActive}
            currentUser={currentUser}
          />
        </Col>
      </Row>
    );
  };

  return loading ? (
    <PageSpinner />
  ) : (
    <>
      {currentUser.teamId ? (
        renderScores()
      ) : (
        <Row>
          <Col>
            <Alert color="warning">
              You are not currently on a team. Click <Link to={Constants.PATHS.START}>HERE</Link> to get started!
            </Alert>
          </Col>
        </Row>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  scores: state.scores,
  currentUser: state.users.all[state.users.current.id],
});

export default connect(mapStateToProps, { fetchUserEventScore, fetchTeamEventScore })(EventScoresPanel);
