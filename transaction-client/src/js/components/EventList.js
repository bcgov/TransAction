import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';

import Event from './Event';
import EventModal from './EventModal';
import EventModalBody from './EventModalBody';
import PageSpinner from './ui/PageSpinner';
import { fetchEvents } from '../actions';

class EventList extends Component {
  state = { modal: false, loading: true };

  componentDidMount() {
    this.props
      .fetchEvents()
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  modalToggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  renderEventList() {
    const events = this.props.events.map(event => (
      <Event key={event.id} event={event} isAdmin={this.props.currentUser.isAdmin} />
    ));

    return events;
  }

  renderAddEventButton() {
    if (this.props.currentUser.isAdmin) {
      return (
        <Row>
          <Col>
            <Button color="primary" className="btn-sm px-3 mb-4" onClick={this.modalToggle}>
              Add an Event
            </Button>
          </Col>
        </Row>
      );
    }
  }

  renderContent() {
    return (
      <React.Fragment>
        {this.renderAddEventButton()}
        {this.state.loading ? <PageSpinner /> : this.renderEventList()}
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Events</BreadcrumbItem>
          </Breadcrumb>
        </Row>
        {this.renderContent()}
        <EventModal toggle={this.modalToggle} isOpen={this.state.modal} text="Add an Event">
          <EventModalBody modalClose={this.modalToggle} name="add" />
        </EventModal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    events: _.orderBy(Object.values(state.events), ['startDate'], ['desc']),
    currentUser: state.users.current,
  };
};

export default connect(
  mapStateToProps,
  { fetchEvents }
)(EventList);
