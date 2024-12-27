import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardHeader, Button, Progress } from 'reactstrap';

import LogActivityForm from '../forms/LogActivityForm';
import ActivityJournalModal from '../ui/ActivityJournalModal';
import * as Constants from '../../Constants';

const ScoreRow = ({ score, description }) => (
  <Row>
    <Col xs="3" lg="4">
      <div className="h5" style={{ whiteSpace: 'nowrap' }}>
        {score}
      </div>
    </Col>
    <Col xs="9" lg="8">
      <small className="text-muted align-bottom">{description}</small>
    </Col>
  </Row>
);

const UserScoreCard = ({
  score,
  teamScore,
  event,
  cardWidth,
  goal,
  refreshStandings,
  currentUser,
  showLogButton,
}) => {
  const [showLogActivityForm, setShowLogActivityForm] = useState(false);
  const [showActivityJournal, setShowActivityJournal] = useState(false);

  const handleLogActivityFormToggle = () => {
    setShowLogActivityForm((prev) => !prev);
  };

  const handleActivityJournalToggle = () => {
    setShowActivityJournal((prev) => !prev);
  };

  const handleShowLogActivityFormClick = () => {
    setShowLogActivityForm(true);
  };

  const renderLogActivityButton = () => {
    if (showLogButton) {
      return (
        <Button color="primary" className="btn-sm" onClick={handleShowLogActivityFormClick}>
          Log Activity
        </Button>
      );
    }
  };

  const progress = goal > 0 && teamScore ? ((teamScore.score / goal) * 100).toFixed(0) : 0;

  return (
    <>
      <Card>
        <CardHeader>
          <Row>
            <Col>
              <Link to={`${Constants.PATHS.EVENT}/${event.id}`} className="text-decoration-none">
                <strong>{event.name}</strong>
              </Link>
            </Col>
            {cardWidth === Constants.USER_SCORE_CARD_WIDTH.WIDE && (
              <Col className="text-right">
                {renderLogActivityButton()}
                <Button
                  color="primary"
                  className="btn-sm ml-2"
                  onClick={() => setShowActivityJournal(true)}
                >
                  View Journal
                </Button>
              </Col>
            )}
          </Row>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              <ScoreRow score={score || 0} description="Personal Score" />
              <ScoreRow score={teamScore || 0} description="Team Score" />
            </Col>
            <Col className="align-self-center text-center">
              {cardWidth === Constants.USER_SCORE_CARD_WIDTH.NARROW && renderLogActivityButton()}
            </Col>
          </Row>
          <Row>
            <Col>{teamScore && goal && <Progress value={progress}>{`${progress}%`}</Progress>}</Col>
          </Row>
        </CardBody>
      </Card>
      {showLogActivityForm && (
        <LogActivityForm
          isOpen={showLogActivityForm}
          toggle={handleLogActivityFormToggle}
          eventId={event.id}
          refreshStandings={refreshStandings}
          initialValues={{
            eventId: event.id,
            userId: currentUser.id,
            teamId: currentUser.teamId,
            activityHours: 0,
            activityMinutes: 0,
            activityId: -1,
          }}
          formType={Constants.FORM_TYPE.ADD}
        />
      )}
      {showActivityJournal && (
        <ActivityJournalModal
          isOpen={showActivityJournal}
          toggle={handleActivityJournalToggle}
          eventId={event.id}
        />
      )}
    </>
  );
};

UserScoreCard.propTypes = {
  score: PropTypes.number,
  teamScore: PropTypes.number,
  event: PropTypes.object.isRequired,
  cardWidth: PropTypes.string.isRequired,
  goal: PropTypes.number,
  refreshStandings: PropTypes.bool,
  showLogButton: PropTypes.bool,
  currentUser: PropTypes.object.isRequired,
};

export default UserScoreCard;
