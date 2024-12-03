import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import Markdown from 'react-markdown';
import moment from 'moment';

import CardWrapper from '../ui/CardWrapper';

import * as utils from '../../utils';
import * as Constants from '../../Constants';

const EventListItem = ({ event, isActive, showEditForm, handleArchiveEvent, handleUnArchiveEvent }) => {
  const showForm = () => {
    showEditForm(event);
  };

  const archiveEvent = () => {
    handleArchiveEvent(event);
  };

  const unArchiveEvent = () => {
    handleUnArchiveEvent(event);
  };

  const renderEditButton = () => {
    if (isActive) {
      return (
        <div className="float-right">
          <Button color="primary" size="sm" className="mr-1" onClick={showForm}>
            Edit
          </Button>
          <Button color="primary" size="sm" onClick={archiveEvent}>
            Archive
          </Button>
        </div>
      );
    } else {
      return (
        <div className="float-right">
          <Button color="primary" size="sm" className="mr-1" onClick={showForm}>
            Edit
          </Button>
          <Button color="primary" size="sm" onClick={unArchiveEvent}>
            Unarchive
          </Button>
        </div>
      );
    }
  };

  return (
    <CardWrapper>
      <Row>
        <Col>
          <div className="mb-2">
            <Link to={`/event/${event.id}`} className="h4 text-decoration-none">
              {event.name}
            </Link>
            {utils.isCurrentUserAdmin() ? renderEditButton() : null}
          </div>
          <p className="text-muted">
            {moment(event.startDate).format('MMMM Do')} to{' '}
            {moment(event.endDate).format('MMMM Do')}
          </p>
          <Markdown children={event.description} allowedElements={Constants.MARKDOWN.ALLOWED} />
          <p>
            <Link to={`/event/${event.id}`}>View Details</Link>
          </p>
        </Col>
      </Row>
    </CardWrapper>
  );
};

export default EventListItem;
