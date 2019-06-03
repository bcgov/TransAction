import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BreadcrumbItem, ListGroup, ListGroupItem } from 'reactstrap';
import Markdown from 'react-markdown';
import moment from 'moment';

import { fetchTopicDetail } from '../actions';
import PageSpinner from './ui/PageSpinner';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as Constants from '../Constants';

class MessageBoardTopicDetail extends React.Component {
  state = { loading: true, topicId: null };
  componentDidMount() {
    const topicId = parseInt(this.props.match.params.id);

    this.props.fetchTopicDetail(topicId).then(() => {
      this.setState({ loading: false, topicId });
    });
  }

  renderContent() {
    const topic = this.props.messages[this.state.topicId];

    return (
      <ListGroup>
        <ListGroupItem>
          <p className="h4">{topic.title}</p>
          <small>
            {topic.userName} - {moment(topic.dbLastUpdateTimestamp).format('YYYY-MM-DD hh:mmA')}
          </small>
        </ListGroupItem>
        {topic.messages.map(message => {
          return (
            <ListGroupItem key={message.id}>
              <Markdown>{message.body}</Markdown>
              <small>
                {message.userName} - {moment(message.dbLastUpdateTimestamp).format('YYYY-MM-DD hh:mmA')}
              </small>
            </ListGroupItem>
          );
        })}
      </ListGroup>
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
  };
};

export default connect(
  mapStateToProps,
  { fetchTopicDetail }
)(MessageBoardTopicDetail);
