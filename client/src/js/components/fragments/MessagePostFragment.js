import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ListGroupItem, Row, Col, Button } from 'reactstrap';
import Markdown from 'react-markdown';
import moment from 'moment';

import EditMessageForm from '../forms/EditMessageForm';
import EditTopicForm from '../forms/EditTopicForm';

import * as utils from '../../utils';
import * as Constants from '../../Constants';

const MessagePostFragment = ({ post, index, currentUser, topic }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showEditTopicForm, setShowEditTopicForm] = useState(false);

  const toggleEditForm = () => setShowEditForm((prev) => !prev);
  const toggleEditTopicForm = () => setShowEditTopicForm((prev) => !prev);

  const canEdit = post.userId === currentUser.id || utils.isCurrentUserAdmin();
  const title = topic ? topic.title : '';
  const originalPost = index === 0;
  const buttonCallback = originalPost ? () => setShowEditTopicForm(true) : () => setShowEditForm(true);

  return (
    <ListGroupItem className="topic-post-block">
      <Row className="topic-post-header justify-content-between">
        <Col>
          <small>
            {originalPost ? 'Original Post' : `Reply #${index}`} - {post.userName} -{' '}
            {moment(post.dbCreateTimestamp).format(Constants.MESSAGE_DATE_FORMAT)}
          </small>
        </Col>
        <Col xs="auto">
          {canEdit && (
            <Button color="primary" size="sm" onClick={buttonCallback}>
              Edit
            </Button>
          )}
        </Col>
      </Row>
      <Markdown allowedElements={Constants.MARKDOWN.ALLOWED}>{post.body}</Markdown>
      {post.concurrencyControlNumber > 1 && (
        <small>
          <em>
            Updated {post.concurrencyControlNumber - 1} time(s). Last updated at{' '}
            {moment(post.dbLastUpdateTimestamp).format(Constants.MESSAGE_DATE_FORMAT)}
          </em>
        </small>
      )}
      {showEditForm && (
        <EditMessageForm
          isOpen={showEditForm}
          toggle={toggleEditForm}
          initialValues={{
            ...post,
          }}
          formType={Constants.FORM_TYPE.EDIT}
          originalPost={originalPost}
          topic={topic}
        />
      )}
      {showEditTopicForm && (
        <EditTopicForm
          isOpen={showEditTopicForm}
          toggle={toggleEditTopicForm}
          initialValues={{
            ...post,
            title: title,
          }}
          formType={Constants.FORM_TYPE.EDIT}
          topic={topic}
        />
      )}
    </ListGroupItem>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.users.all[state.users.current.id],
  };
};

export default connect(mapStateToProps)(MessagePostFragment);
