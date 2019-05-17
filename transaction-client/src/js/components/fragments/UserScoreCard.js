import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardHeader, Button, Progress } from 'reactstrap';

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
  handleOnClick = () => {
    this.props.showLogActivityForm(this.props.event.id);
  };

  renderLogActivityButton = () => {
    return (
      <Button color="primary" className="btn-sm" onClick={this.handleOnClick}>
        Log Activity
      </Button>
    );
  };

  render() {
    const { score, teamScore, event, cardWidth, showLogActivityForm, goal } = this.props;

    let progress = 0;
    if (goal > 0 && teamScore) progress = ((teamScore.score / goal) * 100).toFixed(0);

    return (
      <Card>
        <CardHeader>
          <Row>
            <Col>
              <Link to={`${Constants.PATHS.EVENT}/${event.id}`} className="no-underline">
                <strong>{event.name}</strong>
              </Link>
            </Col>
            <Col className="text-right">
              {showLogActivityForm &&
                cardWidth === Constants.USER_SCORE_CARD_WIDTH.WIDE &&
                this.renderLogActivityButton()}
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              <ScoreRow score={score ? score.score : 0} description="Personal Score" />
              <ScoreRow score={teamScore ? teamScore.score : 0} description="Team Score" />
            </Col>
            <Col className="align-self-center text-center">
              {showLogActivityForm &&
                cardWidth === Constants.USER_SCORE_CARD_WIDTH.NARROW &&
                this.renderLogActivityButton()}
            </Col>
          </Row>
          <Row>
            <Col>{teamScore && goal && <Progress value={progress}>{`${progress}%`}</Progress>}</Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

UserScoreCard.propTypes = {
  score: PropTypes.object,
  teamScore: PropTypes.object,
  event: PropTypes.object.isRequired,
  cardWidth: PropTypes.string.isRequired,
  showLogActivityForm: PropTypes.func,
  goal: PropTypes.number,
};

export default UserScoreCard;
