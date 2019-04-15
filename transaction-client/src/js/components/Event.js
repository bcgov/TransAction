import React from 'react';
import { Row, Col, ButtonGroup, Button } from 'reactstrap';
import moment from 'moment';
import EventModal from './EventModal';
import EventModalBody from './EventModalBody';

class Event extends React.Component {
  state = { modal: false };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  render() {
    //show/hide logic needed using end dates
    return (
      <React.Fragment>
        <Row>
          <Col>
            <h3 className="float-left">{this.props.event.name}</h3>
            <ButtonGroup className="float-right">
              <Button color="primary" onClick={this.toggle}>
                Edit Events
              </Button>
              <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Edit an Event">
                {' '}
                <EventModalBody modalClose={this.toggle} name="edit" id={this.props.event.id} />
              </EventModal>
            </ButtonGroup>
          </Col>
        </Row>
        <div className="float-left float-none mb-4">
          {moment(this.props.event.startDate).format('MMMM Do YYYY')} To{' '}
          {moment(this.props.event.endDate).format('MMMM Do YYYY')}
        </div>
        <div>{this.props.event.description}</div>
      </React.Fragment>
    );
  }
}
export default Event;
