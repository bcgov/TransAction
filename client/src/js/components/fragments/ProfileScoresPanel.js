import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Alert } from 'reactstrap';

import { fetchAllUserScores, fetchAllTeamScores } from '../../actions';
import PageSpinner from '../ui/PageSpinner';
import UserScoreCard from './UserScoreCard';

import * as Constants from '../../Constants';

const ProfileScoresPanel = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const scores = useSelector(state => state.scores);
  const currentUser = useSelector(state => state.users.all[state.users.current.id]);

  useEffect(() => {
    if (currentUser.teamId) {
      Promise.all([
        dispatch(fetchAllUserScores(currentUser.id)),
        dispatch(fetchAllTeamScores(currentUser.teamId))
      ]).then(() => setLoading(false));
    }
    else {
      setLoading(false);
    }

  }, [dispatch, currentUser]);



  const renderUserScores = () => {
    const userIdToDisplay = currentUser.id;
    const teamIdToDisplay = currentUser.teamId;
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
                <>
                  You have not participated in any events yet. Please head to the{' '}
                  <Link to={Constants.PATHS.EVENT}>Events</Link> page to participate in an event.
                </>
              ) : (
                <>
                  You are not currently on a team. Get started <Link to={Constants.PATHS.START}>here</Link>.
                </>
              )}
            </Alert>
          </Col>
        )}
      </Row>
    );
  }

  const renderContent = () => {
    return (
      <>
        <Row className="mb-3">
          <Col>
            <h4>Activity Summary</h4>
          </Col>
        </Row>
        {renderUserScores()}
      </>
    );
  }
  return loading ? <PageSpinner /> : <>{renderContent()}</>;

}

export default ProfileScoresPanel;