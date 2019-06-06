import React from 'react';
import { connect } from 'react-redux';
import { ListGroupItem, Row, Col, Button } from 'reactstrap';
import Markdown from 'react-markdown';
import moment from 'moment';

import EditMessageForm from '../forms/EditMessageForm';
import EditTopicForm from '../forms/EditTopicForm';

import * as utils from '../../utils';
import * as Constants from '../../Constants';

class MessagePostFragment extends React.Component {
  state = { showEditForm: false, showEditTopicForm: false };

  showEditForm = () => {
    this.setState({ showEditForm: true });
  };

  toggleEditForm = () => {
    this.setState(prevState => ({
      showEditForm: !prevState.showEditForm,
    }));
  };

  showEditTopicForm = () => {
    this.setState({ showEditTopicForm: true });
  };

  toggleEditTopicForm = () => {
    this.setState(prevState => ({
      showEditTopicForm: !prevState.showEditTopicForm,
    }));
  };

  render() {
    const { post, index, currentUser, topic } = this.props;
    const canEdit = post.userId === currentUser.id || utils.isCurrentUserAdmin();
    const title = topic ? topic.title : '';
    const originalPost = index === 0;
    const buttonCallback = originalPost ? this.showEditTopicForm : this.showEditForm;

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
        <Markdown allowedTypes={Constants.MARKDOWN.ALLOWED}>{post.body}</Markdown>
        {post.concurrencyControlNumber > 1 && (
          <small>
            <em>
              Updated {post.concurrencyControlNumber} times. Last updated at{' '}
              {moment(post.dbLastUpdateTimestamp).format(Constants.MESSAGE_DATE_FORMAT)}
            </em>
          </small>
        )}
        {this.state.showEditForm && (
          <EditMessageForm
            isOpen={this.state.showEditForm}
            toggle={this.toggleEditForm}
            initialValues={{
              ...post,
            }}
            formType={Constants.FORM_TYPE.EDIT}
            originalPost={originalPost}
            topic={topic}
          />
        )}

        {this.state.showEditTopicForm && (
          <EditTopicForm
            isOpen={this.state.showEditTopicForm}
            toggle={this.toggleEditTopicForm}
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
