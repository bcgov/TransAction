import React, { Component } from 'react';
import { Button, Row, Col, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';

import EventListItem from './fragments/EventListItem';
import EditEventForm from './forms/EditEventForm';
import PageSpinner from './ui/PageSpinner';
import { fetchEvents, archiveEvent } from '../actions';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import DialogModal from './ui/DialogModal';
import ScrollLoader from './fragments/ScollLoader';

import * as api from '../api/api';
import * as utils from '../utils';
import * as Constants from '../Constants';
class EventList extends Component {
  state = {
    loading: true,
    showEventForm: false,
    eventFormType: Constants.FORM_TYPE.ADD,
    eventFormInitialValues: null,
    showConfirmDialog: false,
    confirmDialogOptions: {},
    searchTerm: undefined,
    page: 0,
    pageSize: 3,
    pageCount: 1,
  };

  componentDidMount() {
    api.resetCancelTokenSource();
    this.loadData();
  }

  componentWillUnmount() {
    api.cancelRequest();
  }

  loadData = () => {
    const nextPage = this.state.page + 1;
    if (this.state.page < this.state.pageCount) {
      this.props.fetchEvents(this.state.searchTerm, nextPage, this.state.pageSize).then(pageCount => {
        this.setState({ loading: false, page: nextPage, pageCount });
      });
    }
  };

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

  archiveEvent = (confirm, event) => {
    if (confirm) {
      this.props.archiveEvent(event).then(() => this.closeConfirmDialog());
    } else {
      this.closeConfirmDialog();
    }
  };

  confirmArchive = event => {
    this.setState({
      showConfirmDialog: true,
      confirmDialogOptions: {
        title: 'Archive Event?',
        body: 'The event will be archived and hidden from view.',
        secondary: true,
        callback: confirm => this.archiveEvent(confirm, event),
      },
    });
  };

  closeConfirmDialog() {
    this.setState({ showConfirmDialog: false, confirmDialogOptions: {}, clicked: false });
  }

  renderEventList() {
    const events = this.props.events.map(event => (
      <EventListItem
        key={event.id}
        event={event}
        isAdmin={utils.isCurrentUserAdmin()}
        showEditForm={this.showEditEventForm}
        handleArchiveEvent={this.confirmArchive}
      />
    ));

    return events.length === 0 ? <Alert color="primary">There are no active events at the moment.</Alert> : events;
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
        {this.state.loading ? (
          <PageSpinner />
        ) : (
          <ScrollLoader loader={this.loadData} page={this.state.page} pageCount={this.state.pageCount}>
            {this.renderEventList()}
          </ScrollLoader>
        )}
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
        {this.state.showConfirmDialog && (
          <DialogModal isOpen={this.state.showConfirmDialog} options={this.state.confirmDialogOptions} />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    events: _.orderBy(Object.values(state.events), ['startDate'], ['desc']),
    currentUser: state.users.all[state.users.current.id],
  };
};

export default connect(
  mapStateToProps,
  { fetchEvents, archiveEvent }
)(EventList);
