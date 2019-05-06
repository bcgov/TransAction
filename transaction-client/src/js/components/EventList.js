import React, { Component } from 'react';
import _ from 'lodash';
import { Breadcrumb, BreadcrumbItem, Button, Spinner, Row } from 'reactstrap';
import { connect } from 'react-redux';

import Event from './Event';
import EventModal from './EventModal';
import EventModalBody from './EventModalBody';
import { fetchEvents } from '../actions';
import * as Constants from '../Constants';

//import ArchivedEvent from './ArchivedEvent';

class EventList extends Component {
  state = { modal: false, loading: true };

  componentDidMount() {
    Promise.all([this.props.fetchEvents()])
      .then(() => {
        this.toggleSpinner();
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

  toggleSpinner = () => {
    this.setState(prevState => ({
      loading: !prevState.loading,
    }));
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  renderEventList() {
    const events = this.props.events.map(event => (
      <div key={event.id} className="mb-5">
        <Event event={event} />
      </div>
    ));

    return events;
  }

  decideRender() {
    if (this.state.isSpin === true) {
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    } else {
      return this.renderEventList();
    }
  }

  checkAdmin() {
    if (this.props.authUser.role_name === Constants.ROLE.ADMIN) {
      return (
        <React.Fragment>
          <Button color="primary" className="btn-sm px-3 mb-4" onClick={this.toggle}>
            Add an Event
          </Button>
          <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Add an Event">
            <EventModalBody modalClose={this.toggle} name="add" />
          </EventModal>
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Breadcrumb>
            <BreadcrumbItem active>Home</BreadcrumbItem>
          </Breadcrumb>
        </Row>
        {this.checkAdmin()}
        <div>{this.decideRender()}</div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  //sorts by start date

  return {
    events: _.orderBy(Object.values(state.events), ['startDate'], ['desc']),
    authUser: state.authUser,
  };
};

export default connect(
  mapStateToProps,
  { fetchEvents }
)(EventList);
