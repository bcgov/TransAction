import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardHeader, Button, Progress } from 'reactstrap';

import LogActivityForm from '../forms/LogActivityForm';
import ActivityJournalModal from '../ui/ActivityJournalModal';
import * as Constants from '../../Constants';

const ScoreRow = ({ score, description }) => {
  return (
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
};

class UserScoreCard extends React.Component {
  state = { loading: true, showLogActivityForm: false, showActivityJournal: false };

  showLogActivityForm = () => {
    this.setState({ showLogActivityForm: true });
  };

  toggleLogActivityForm = () => {
    this.setState(prevState => ({
      showLogActivityForm: !prevState.showLogActivityForm,
    }));
  };

  showActivityJournal = () => {
    this.setState({ showActivityJournal: true });
  };

  toggleActivityJournal = () => {
    this.setState(prevState => ({
      showActivityJournal: !prevState.showActivityJournal,
    }));
  };

  handleShowLogActivityFormClick = () => {
    this.showLogActivityForm(this.props.event.id);
  };

  renderLogActivityButton = () => {
    return (
      <Button color="primary" className="btn-sm" onClick={this.handleShowLogActivityFormClick}>
        Log Activity
      </Button>
    );
  };

  render() {
    const { score, teamScore, event, cardWidth, goal, refreshStandings } = this.props;

    let progress = 0;
    if (goal > 0 && teamScore) progress = ((teamScore.score / goal) * 100).toFixed(0);

    return (
      <React.Fragment>
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
                  {this.renderLogActivityButton()}
                  <Button color="primary" className="btn-sm ml-2" onClick={this.showActivityJournal}>
                    View Journal
                  </Button>
                </Col>
              )}
            </Row>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <ScoreRow score={score ? score : 0} description="Personal Score" />
                <ScoreRow score={teamScore ? teamScore : 0} description="Team Score" />
              </Col>
              <Col className="align-self-center text-center">
                {cardWidth === Constants.USER_SCORE_CARD_WIDTH.NARROW && this.renderLogActivityButton()}
              </Col>
            </Row>
            <Row>
              <Col>{teamScore && goal && <Progress value={progress}>{`${progress}%`}</Progress>}</Col>
            </Row>
          </CardBody>
        </Card>
        {this.state.showLogActivityForm && (
          <LogActivityForm
            isOpen={this.state.showLogActivityForm}
            toggle={this.toggleLogActivityForm}
            eventId={event.id}
            refreshStandings={refreshStandings}
          />
        )}
        {this.state.showActivityJournal && (
          <ActivityJournalModal
            isOpen={this.state.showActivityJournal}
            toggle={this.toggleActivityJournal}
            eventId={event.id}
          />
        )}
      </React.Fragment>
    );
  }
}

UserScoreCard.propTypes = {
  score: PropTypes.number,
  teamScore: PropTypes.number,
  event: PropTypes.object.isRequired,
  cardWidth: PropTypes.string.isRequired,
  showLogActivityForm: PropTypes.func,
  goal: PropTypes.number,
  refreshStandings: PropTypes.bool,
};

export default UserScoreCard;
