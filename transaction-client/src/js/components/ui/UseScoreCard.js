import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardHeader, Button } from 'reactstrap';

import * as Constants from '../../Constants';

const UseScoreCard = ({ score, teamScore, event, cardWidth }) => {
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
            {cardWidth === Constants.USER_SCORE_CARD_WIDTH.WIDE && (
              <Button color="primary" className="btn-sm">
                Log Activity
              </Button>
            )}
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <Row>
          <Col>
            <Row>
              <Col xs="3" lg="4">
                <div className="h5" style={{ whiteSpace: 'nowrap' }}>
                  {score.score}
                </div>
              </Col>
              <Col xs="9" lg="8">
                <small className="text-muted align-bottom">Personal Score</small>
              </Col>
            </Row>
            <Row>
              <Col xs="3" lg="4">
                <div className="h5" style={{ whiteSpace: 'nowrap' }}>
                  {teamScore ? teamScore.score : 0}
                </div>
              </Col>
              <Col xs="9" lg="8">
                <small className="text-muted align-bottom">Team Score</small>
              </Col>
            </Row>
          </Col>
          <Col className="align-self-center text-center">
            {cardWidth === Constants.USER_SCORE_CARD_WIDTH.NARROW && (
              <Button color="primary" className="btn-sm">
                Log Activity
              </Button>
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default UseScoreCard;
