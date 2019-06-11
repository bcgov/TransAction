import React, { Component } from 'react';
import { Button, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';

import EventListItem from './fragments/EventListItem';
import EditEventForm from './forms/EditEventForm';
import PageSpinner from './ui/PageSpinner';
import { fetchEvents, archiveEvent } from '../actions';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as utils from '../utils';
import * as Constants from '../Constants';
class EventList extends Component {
  state = {
    loading: true,
    showEventForm: false,
    eventFormType: Constants.FORM_TYPE.ADD,
    eventFormInitialValues: null,
    archiving: false,
  };

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

  archiveEvent = event => {
    if (!this.state.archiving) {
      this.setState({ archiving: true });
      this.props.archiveEvent(event).then(() => {
        this.setState({ archiving: false });
      });
    }
  };

  renderEventList() {
    const events = this.props.events.map(event => (
      <EventListItem
        key={event.id}
        event={event}
        isAdmin={utils.isCurrentUserAdmin()}
        showEditForm={this.showEditEventForm}
        handleArchiveEvent={this.archiveEvent}
        archiving={this.state.archiving}
      />
    ));

    return events;
  }

  renderAddEventButton() {
    if (utils.isCurrentUserAdmin()) {
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
        <BreadcrumbFragment>{[{ active: true, text: 'Events' }]}</BreadcrumbFragment>
        {this.renderContent()}
        {this.state.showEventForm && (
          <EditEventForm
            initialValues={this.state.eventFormInitialValues}
            isOpen={this.state.showEventForm}
            toggle={this.toggleEventForm}
            formType={this.state.eventFormType}
          />
        )}
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
  { fetchEvents, archiveEvent }
)(EventList);
