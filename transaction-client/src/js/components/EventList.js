import React, { Component } from 'react';
import { BreadcrumbItem, Button, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';

import EventListItem from './fragments/EventListItem';
import EditEventForm from './forms/EditEventForm';
import PageSpinner from './ui/PageSpinner';
import { fetchEvents } from '../actions';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as Constants from '../Constants';
class EventList extends Component {
  state = { loading: true, showEventForm: false, eventFormType: Constants.FORM_TYPE.ADD, eventFormInitialValues: null };

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

  showAddEventForm = () => {
    this.setState({ showEventForm: true, eventFormType: Constants.FORM_TYPE.ADD, eventFormInitialValues: null });
  };

  showEditEventForm = initialValues => {
    this.setState({
      showEventForm: true,
      eventFormType: Constants.FORM_TYPE.EDIT,
      eventFormInitialValues: initialValues,
    });
  };

  toggleEventForm = () => {
    this.setState(prevState => ({
      showEventForm: !prevState.showEventForm,
    }));
  };

  renderEventList() {
    const events = this.props.events.map(event => (
      <EventListItem
        key={event.id}
        event={event}
        isAdmin={this.props.currentUser.isAdmin}
        showEditForm={this.showEditEventForm}
      />
    ));

    return events;
  }

  renderAddEventButton() {
    if (this.props.currentUser.isAdmin) {
      return (
        <Row>
          <Col>
            <Button color="primary" className="btn-sm mb-4" onClick={this.showAddEventForm}>
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
        <BreadcrumbFragment>
          <BreadcrumbItem active>Events</BreadcrumbItem>
        </BreadcrumbFragment>
        {this.renderContent()}
        <EditEventForm
          initialValues={this.state.eventFormInitialValues}
          isOpen={this.state.showEventForm}
          toggle={this.toggleEventForm}
          formType={this.state.eventFormType}
        />
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
