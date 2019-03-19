import React from 'react';
import { Row, Container, Col, ButtonGroup } from 'reactstrap';
import MyButtons from './MyButtons';

const Event = props => {
  const event = props.event;

  return (
    <Container>
      <Row>
        <Col>
          <h3 className="float-left">{event.name}</h3>
          <ButtonGroup className="float-right">
            <MyButtons name="edit" />
            <MyButtons name="delete" />
          </ButtonGroup>
        </Col>
      </Row>
      <div>{event.description}</div>
    </Container>
  );
};
export default Event;
