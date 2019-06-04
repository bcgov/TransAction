import React from 'react';
import { connect } from 'react-redux';
import { ListGroupItem, Row, Col, Button } from 'reactstrap';
import Markdown from 'react-markdown';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD hh:mmA';

class MessagePostFragment extends React.Component {
  render() {
    const { message, index, currentUser } = this.props;
    const canEdit = message.userId === currentUser.id || currentUser.isAdmin;

    return (
      <ListGroupItem className="topic-message-block">
        <Row className="topic-message-header justify-content-between">
          <Col>
            <small>
              {index === 0 ? 'Original Post' : `Reply #${index}`} - {message.userName} -{' '}
              {moment(message.dbCreateTimestamp).format(dateFormat)}
            </small>
          </Col>
          <Col xs="auto">
            {canEdit && (
              <Button color="primary" size="sm">
                Edit
              </Button>
            )}
          </Col>
        </Row>
        <Markdown>{message.body}</Markdown>
        {message.concurrencyControlNumber > 1 && (
          <small>
            <em>
              Updated {message.concurrencyControlNumber} times. Last updated at{' '}
              {moment(message.dbLastUpdateTimestamp).format(dateFormat)}
            </em>
          </small>
        )}
      </ListGroupItem>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.current,
  };
};

export default connect(
  mapStateToProps,
  null
)(MessagePostFragment);
