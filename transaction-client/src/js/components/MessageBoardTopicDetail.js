import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, BreadcrumbItem, ListGroup, Row, Col } from 'reactstrap';

import { fetchTopicDetail } from '../actions';
import PageSpinner from './ui/PageSpinner';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import MessagePostFragment from './fragments/MessagePostFragment';
import CreateMessageForm from './forms/CreateMessageForm';

import * as Constants from '../Constants';

class MessageBoardTopicDetail extends React.Component {
  state = { loading: true, topicId: null, showReplyForm: false };

  componentDidMount() {
    const topicId = parseInt(this.props.match.params.id);
    const { messages, fetchTopicDetail } = this.props;

    if (!messages[topicId]) {
      fetchTopicDetail(topicId).then(() => {
        this.setState({ loading: false, topicId });
      });
    } else {
      this.setState({ loading: false, topicId });
    }
  }

  showReplyForm = () => {
    this.setState({ showReplyForm: true });
  };

  toggleReplyForm = () => {
    this.setState(prevState => ({
      showReplyForm: !prevState.showReplyForm,
    }));
  };

  renderContent() {
    const topic = this.props.messages[this.state.topicId];
    const firstMessage = topic.messages[0];

    return (
      <React.Fragment>
        <Row>
          <Col>
            <span className="h4">{topic.title}</span>
            <Button color="primary" size="sm" className="float-right" onClick={this.showReplyForm}>
              Reply
            </Button>
          </Col>
        </Row>
        <ListGroup className="mt-3">
          <MessagePostFragment message={firstMessage} index={0} />
          {topic.messages.slice(1).map((message, index) => {
            return <MessagePostFragment key={message.id} message={message} index={index + 1} />;
          })}
        </ListGroup>
        <Row className="mt-3">
          <Col>
            <Button color="primary" size="sm" className="float-right" onClick={this.showReplyForm}>
              Reply
            </Button>
          </Col>
        </Row>
        {this.state.showReplyForm && (
          <CreateMessageForm
            isOpen={this.state.showReplyForm}
            toggle={this.toggleReplyForm}
            initialValues={{ topicId: this.state.topicId, userId: this.props.currentUser.id }}
          />
        )}
      </React.Fragment>
    );
  }

  render() {
    const topic = this.props.messages[this.state.topicId];

    return (
      <React.Fragment>
        <BreadcrumbFragment>
          <BreadcrumbItem>
            <Link to={Constants.PATHS.MESSAGES}>Messages</Link>
          </BreadcrumbItem>
          {topic && <BreadcrumbItem>{topic.title}</BreadcrumbItem>}
        </BreadcrumbFragment>

        {this.state.loading ? <PageSpinner /> : <CardWrapper>{this.renderContent()}</CardWrapper>}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.messages,
    currentUser: state.users.current,
  };
};

export default connect(
  mapStateToProps,
  { fetchTopicDetail }
)(MessageBoardTopicDetail);
