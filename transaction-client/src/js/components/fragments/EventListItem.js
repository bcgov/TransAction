import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import Markdown from 'react-markdown';
import moment from 'moment';

import * as Constants from '../../Constants';

class EventListItem extends React.Component {
  showForm = () => {
    this.props.showEditForm(this.props.event);
  };

  renderEditButton() {
    return (
      <div className="float-right">
        <Button color="primary" size="sm" className="mr-1" onClick={this.showForm}>
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
              {this.props.isAdmin ? this.renderEditButton() : ''}
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
      </React.Fragment>
    );
  }
}

export default EventListItem;
