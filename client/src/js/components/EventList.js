import React, { Component } from 'react';
import { Button, Row, Col, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';

import EventListItem from './fragments/EventListItem';
import EditEventForm from './forms/EditEventForm';
import PageSpinner from './ui/PageSpinner';
import { fetchEvents, archiveEvent, unarchiveEvent } from '../actions';
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
    isActive: true,
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
      this.props
        .fetchEvents(this.state.searchTerm, nextPage, this.state.pageSize, this.state.isActive)
        .then(pageCount => {
          this.setState({ loading: false, page: nextPage, pageCount });
        });
    }
  };

  showArchiveEvents = () => {
    this.setState({ isActive: false, page: 0 }, () => {
      this.loadData();
    });
  };

  showActiveEvents = () => {
    this.setState({ isActive: true, page: 0 }, () => {
      this.loadData();
    });
  };

  loadMoreData = () => {
    if (this.state.page <= this.state.pageCount) this.loadData();
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
      this.props.archiveEvent(event).finally(() => this.closeConfirmDialog());
    } else {
      this.closeConfirmDialog();
    }
  };

  unarchiveEvent = (confirm, event) => {
    if (confirm) {
      this.props.unarchiveEvent(event).finally(() => this.closeConfirmDialog());
    } else {
      this.closeConfirmDialog();
    }
  };

  confirmUnArchive = event => {
    this.setState({
      showConfirmDialog: true,
      confirmDialogOptions: {
        title: 'UnArchive Event',
        body: 'The event will be unarchived and enable user participation',
        secondary: true,
        callback: confirm => this.unarchiveEvent(confirm, event),
      },
    });
  };

  confirmArchive = event => {
    this.setState({
      showConfirmDialog: true,
      confirmDialogOptions: {
        title: 'Archive Event?',
        body: 'The event will be archived and disable user participation',
        secondary: true,
        callback: confirm => this.archiveEvent(confirm, event),
      },
    });
  };

  closeConfirmDialog() {
    this.setState({ showConfirmDialog: false, confirmDialogOptions: {}, clicked: false });
  }

  renderEventList() {
    const events = _.filter(this.props.events, o => {
      return o.isActive === this.state.isActive;
    }).map(event => (
      <EventListItem
        key={event.id}
        event={event}
        isAdmin={utils.isCurrentUserAdmin()}
        showEditForm={this.showEditEventForm}
        handleArchiveEvent={this.confirmArchive}
        handleUnArchiveEvent={this.confirmUnArchive}
        isActive={event.isActive}
      />
    ));

    return events.length === 0 ? (
      this.state.isActive ? (
        <Alert color="primary">There are no active events at the moment.</Alert>
      ) : (
        <Alert color="primary">There are no archived events at the moment.</Alert>
      )
    ) : (
      events
    );
  }

  renderContent() {
    return (
      <React.Fragment>
        <Row>
          <Col>
            {utils.isCurrentUserAdmin() && (
              <Button color="primary" className="btn-sm mb-4" onClick={this.showAddEventForm}>
                Add an Event
              </Button>
            )}

            {this.state.isActive ? (
              <Button color="primary" className="float-right btn-sm mb-4" onClick={this.showArchiveEvents}>
                Show Archived Events
              </Button>
            ) : (
              <Button color="primary" className="float-right btn-sm mb-4" onClick={this.showActiveEvents}>
                Show Active Events
              </Button>
            )}
          </Col>
        </Row>
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
  { fetchEvents, archiveEvent, unarchiveEvent }
)(EventList);
