import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import Markdown from 'react-markdown';
import moment from 'moment';

import CardWrapper from '../ui/CardWrapper';

import * as utils from '../../utils';
import * as Constants from '../../Constants';

class EventListItem extends React.Component {
  showForm = () => {
    this.props.showEditForm(this.props.event);
  };

  archiveEvent = () => {
    this.props.handleArchiveEvent(this.props.event);
  };

  unArchiveEvent = () => {
    this.props.handleUnArchiveEvent(this.props.event);
  };
  renderEditButton() {
    if (this.props.isActive) {
      return (
        <div className="float-right">
          <Button color="primary" size="sm" className="mr-1" onClick={this.showForm}>
            Edit
          </Button>
          <Button color="primary" size="sm" onClick={this.archiveEvent}>
            Archive
          </Button>
        </div>
      );
    } else {
      return (
        <div className="float-right">
          <Button color="primary" size="sm" className="mr-1" onClick={this.showForm}>
            Edit
          </Button>
          <Button color="primary" size="sm" onClick={this.unArchiveEvent}>
            Unarchive
          </Button>
        </div>
      );
    }
  }

  render() {
    return (
      <CardWrapper>
        <Row>
          <Col>
            <div className="mb-2">
              <Link to={`/event/${this.props.event.id}`} className="h4 text-decoration-none">
                {this.props.event.name}
              </Link>
              {utils.isCurrentUserAdmin() ? this.renderEditButton() : ''}
            </div>
            <p className="text-muted">
              {moment(this.props.event.startDate).format('MMMM Do, YYYY')} to{' '}
              {moment(this.props.event.endDate).format('MMMM Do, YYYY')}
            </p>
            <Markdown source={this.props.event.description} allowedTypes={Constants.MARKDOWN.ALLOWED} />
            <p>
              <Link to={`/event/${this.props.event.id}`}>View Details</Link>
            </p>
          </Col>
        </Row>
      </CardWrapper>
    );
  }
}

export default EventListItem;
