import React from 'react';
import { connect } from 'react-redux';
import { ListGroupItem, Row, Col, Button } from 'reactstrap';
import Markdown from 'react-markdown';
import moment from 'moment';

import CreateMessageForm from '../forms/EditMessageForm';

import * as Constants from '../../Constants';

const dateFormat = 'YYYY-MM-DD hh:mmA';

class MessagePostFragment extends React.Component {
  state = { showEditForm: false };

  showEditForm = () => {
    this.setState({ showEditForm: true });
  };

  toggleEditForm = () => {
    this.setState(prevState => ({
      showEditForm: !prevState.showEditForm,
    }));
  };

  render() {
    const { post, index, currentUser, topic } = this.props;
    const canEdit = post.userId === currentUser.id || currentUser.isAdmin;
    const title = topic ? topic.title : '';
    const originalPost = index === 0;

    return (
      <ListGroupItem className="topic-post-block">
        <Row className="topic-post-header justify-content-between">
          <Col>
            <small>
              {originalPost ? 'Original Post' : `Reply #${index}`} - {post.userName} -{' '}
              {moment(post.dbCreateTimestamp).format(dateFormat)}
            </small>
          </Col>
          <Col xs="auto">
            {canEdit && (
              <Button color="primary" size="sm" onClick={this.showEditForm}>
                Edit
              </Button>
            )}
          </Col>
        </Row>
        <Markdown>{post.body}</Markdown>
        {post.concurrencyControlNumber > 1 && (
          <small>
            <em>
              Updated {post.concurrencyControlNumber} times. Last updated at{' '}
              {moment(post.dbLastUpdateTimestamp).format(dateFormat)}
            </em>
          </small>
        )}
        {this.state.showEditForm && (
          <CreateMessageForm
            isOpen={this.state.showEditForm}
            toggle={this.toggleEditForm}
            initialValues={{
              ...post,
              title: title,
            }}
            formType={Constants.FORM_TYPE.EDIT}
            originalPost={originalPost}
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
