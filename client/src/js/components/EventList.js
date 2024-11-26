import React, { useState, useEffect } from 'react';
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

const EventList = ({ fetchEvents, archiveEvent, unarchiveEvent, events }) => {
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormType, setEventFormType] = useState(Constants.FORM_TYPE.ADD);
  const [eventFormInitialValues, setEventFormInitialValues] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogOptions, setConfirmDialogOptions] = useState({});
  const [searchTerm, setSearchTerm] = useState(undefined);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(3);
  const [pageCount, setPageCount] = useState(1);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    api.resetCancelTokenSource();
    loadData();
    return () => {
      api.cancelRequest();
    };
  }, [page, isActive]);

  const loadData = () => {
    if (page < pageCount) {
      fetchEvents(searchTerm, page + 1, pageSize, isActive).then(newPageCount => {
        setLoading(false);
        setPage(page + 1);
        setPageCount(newPageCount);
      });
    }
  };

  const showArchiveEvents = () => {
    setIsActive(false);
    setPage(0);
  };

  const showActiveEvents = () => {
    setIsActive(true);
    setPage(0);
  };

  const loadMoreData = () => {
    if (page <= pageCount) loadData();
  };

  const showAddEventForm = () => {
    setShowEventForm(true);
    setEventFormType(Constants.FORM_TYPE.ADD);
    setEventFormInitialValues(null);
  };

  const showEditEventForm = initialValues => {
    setShowEventForm(true);
    setEventFormType(Constants.FORM_TYPE.EDIT);
    setEventFormInitialValues(initialValues);
  };

  const toggleEventForm = () => {
    setShowEventForm(prevState => !prevState);
  };

  const archiveEventHandler = (confirm, event) => {
    if (confirm) {
      archiveEvent(event).finally(() => closeConfirmDialog());
    } else {
      closeConfirmDialog();
    }
  };

  const unarchiveEventHandler = (confirm, event) => {
    if (confirm) {
      unarchiveEvent(event).finally(() => closeConfirmDialog());
    } else {
      closeConfirmDialog();
    }
  };

  const confirmUnArchive = event => {
    setShowConfirmDialog(true);
    setConfirmDialogOptions({
      title: 'UnArchive Event',
      body: 'The event will be unarchived and enable user participation',
      secondary: true,
      callback: confirm => unarchiveEventHandler(confirm, event),
    });
  };

  const confirmArchive = event => {
    setShowConfirmDialog(true);
    setConfirmDialogOptions({
      title: 'Archive Event?',
      body: 'The event will be archived and disable user participation',
      secondary: true,
      callback: confirm => archiveEventHandler(confirm, event),
    });
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setConfirmDialogOptions({});
  };

  const renderEventList = () => {
    const filteredEvents = _.filter(events, o => o.isActive === isActive);

    if (filteredEvents.length === 0) {
      return isActive ? (
        <Alert color="primary">There are no active events at the moment.</Alert>
      ) : (
        <Alert color="primary">There are no archived events at the moment.</Alert>
      );
    }

    return filteredEvents.map(event => (
      <EventListItem
        key={event.id}
        event={event}
        isAdmin={utils.isCurrentUserAdmin()}
        showEditForm={showEditEventForm}
        handleArchiveEvent={confirmArchive}
        handleUnArchiveEvent={confirmUnArchive}
        isActive={event.isActive}
      />
    ));
  };

  const renderContent = () => (
    <>
      <Row>
        <Col>
          {utils.isCurrentUserAdmin() && (
            <Button color="primary" className="btn-sm mb-4" onClick={showAddEventForm}>
              Add an Event
            </Button>
          )}

          {isActive ? (
            <Button color="primary" className="float-right btn-sm mb-4" onClick={showArchiveEvents}>
              Show Archived Events
            </Button>
          ) : (
            <Button color="primary" className="float-right btn-sm mb-4" onClick={showActiveEvents}>
              Show Active Events
            </Button>
          )}
        </Col>
      </Row>
      {loading ? (
        <PageSpinner />
      ) : (
        <ScrollLoader loader={loadData} page={page} pageCount={pageCount}>
          {renderEventList()}
        </ScrollLoader>
      )}
    </>
  );

  return (
    <>
      <BreadcrumbFragment>{[{ active: true, text: 'Events' }]}</BreadcrumbFragment>
      {renderContent()}
      {showEventForm && (
        <EditEventForm
          initialValues={eventFormInitialValues}
          isOpen={showEventForm}
          toggle={toggleEventForm}
          formType={eventFormType}
        />
      )}
      {showConfirmDialog && (
        <DialogModal isOpen={showConfirmDialog} options={confirmDialogOptions} />
      )}
    </>
  );
};

const mapStateToProps = state => ({
  events: _.orderBy(Object.values(state.events), ['startDate'], ['desc']),
  currentUser: state.users.all[state.users.current.id],
});

export default connect(mapStateToProps, { fetchEvents, archiveEvent, unarchiveEvent })(EventList);
