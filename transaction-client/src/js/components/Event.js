import React from 'react';
import { Row, Container, Col, ButtonGroup, Button } from 'reactstrap';
import ModalEvent from './ModalEvent';

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h3 className="float-left">{this.props.event.name}</h3>

            <ButtonGroup className="float-right">
              <Button color="primary" onClick={this.toggle}>
                Edit Events
              </Button>
              <ModalEvent name="edit" id={this.props.event.id} toggle={this.toggle} isOpen={this.state.modal} />
            </ButtonGroup>
            <h5 className="float-right px-3 mx-3 mb-4">End date: {this.props.event.endDate}</h5>
          </Col>
        </Row>
        <div>{this.props.event.description}</div>
      </Container>
    );
  }
}
export default Event;
