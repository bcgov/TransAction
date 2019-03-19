import React from 'react';
import { Row, Container, Col, ButtonGroup } from 'reactstrap';
import Buttons from './Buttons';

const Event = props => {
  const event = props.event;

  return (
    <Container>
      <Row>
        <Col>
          <h3 className="float-left">{event.name}</h3>
          <ButtonGroup className="float-right">
            <Buttons name="edit" />
            <Buttons name="delete" />
          </ButtonGroup>
        </Col>
      </Row>
      <div>{event.description}</div>
    </Container>
  );
};
export default Event;
