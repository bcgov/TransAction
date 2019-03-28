import React from 'react';
import { Row, Container, Col, ButtonGroup } from 'reactstrap';
import ModalEvent from './ModalEvent';

const Event = props => {
  const event = props.event;

  return (
    <Container>
      <Row>
        <Col>
          <h3 className="float-left">{event.name}</h3>
          <ButtonGroup className="float-right">
            <ModalEvent name="edit" body={event.description} id="edit" />
            <ModalEvent name="delete" body={event.description} />
          </ButtonGroup>
        </Col>
      </Row>
      <div>{event.description}</div>
    </Container>
  );
};
export default Event;
