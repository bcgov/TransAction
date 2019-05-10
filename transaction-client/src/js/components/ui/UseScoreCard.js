import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardHeader } from 'reactstrap';

import * as Constants from '../../Constants';

const UseScoreCard = props => {
  const { score, teamScore, event } = props;

  return (
    <Card>
      <CardHeader>
        <Link to={`${Constants.PATHS.EVENT}/${event.id}`} className="no-underline">
          <strong>{event.name}</strong>
        </Link>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs="2" lg="3">
            <div className="h5" style={{ whiteSpace: 'nowrap' }}>
              {score.score}
            </div>
          </Col>
          <Col xs="10" lg="9">
            <small className="text-muted align-bottom">Personal Score</small>
          </Col>
        </Row>
        <Row>
          <Col xs="2" lg="3">
            <div className="h5" style={{ whiteSpace: 'nowrap' }}>
              {teamScore ? teamScore.score : 0}
            </div>
          </Col>
          <Col xs="10" lg="9">
            <small className="text-muted align-bottom">Team Score</small>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default UseScoreCard;
