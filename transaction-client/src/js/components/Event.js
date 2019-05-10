import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import moment from 'moment';

import EventModal from './EventModal';
import EventModalBody from './EventModalBody';

class Event extends React.Component {
  state = { isAdmin: false, modal: false };

  componentDidMount() {
    this.setState({ isAdmin: this.props.isAdmin });
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  renderEditButton() {
    return (
      <div className="float-right">
        <Button color="primary" size="sm" className="mr-1" onClick={this.toggleModal}>
          Edit
        </Button>
        <Button color="primary" size="sm">
          Archive
        </Button>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Row className="mb-5">
          <Col>
            <div className="mb-2">
              <Link to={`/event/${this.props.event.id}`} className="h4 no-underline">
                {this.props.event.name}
              </Link>
              {this.state.isAdmin ? this.renderEditButton() : ''}
            </div>
            <p className="text-muted">
              {moment(this.props.event.startDate).format('MMMM Do, YYYY')} to{' '}
              {moment(this.props.event.endDate).format('MMMM Do, YYYY')}
            </p>
            <p>{this.props.event.description}</p>
            <p>
              <Link to={`/event/${this.props.event.id}`}>View Details</Link>
            </p>
          </Col>
          <EventModal toggle={this.toggleModal} isOpen={this.state.modal} text="Edit an Event">
            <EventModalBody modalClose={this.toggleModal} name="edit" id={this.props.event.id} />
          </EventModal>
        </Row>
      </React.Fragment>
    );
  }
}

export default Event;
