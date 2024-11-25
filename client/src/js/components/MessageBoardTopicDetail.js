import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, ListGroup, Row, Col } from 'reactstrap';

import { fetchTopicDetail } from '../actions';
import PageSpinner from './ui/PageSpinner';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import MessagePostFragment from './fragments/MessagePostFragment';
import EditMessageForm from './forms/EditMessageForm';

import * as api from '../api/api';
import * as Constants from '../Constants';

const MessageBoardTopicDetail = ({ messages, fetchTopicDetail, currentUser }) => {
  const { id } = useParams(); // Get the `id` param from the route
  const [loading, setLoading] = useState(true);
  const [topicId, setTopicId] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    api.resetCancelTokenSource();
    const topicIdFromParams = parseInt(id);

    if (!messages[topicIdFromParams]) {
      fetchTopicDetail(topicIdFromParams).then(() => {
        setLoading(false);
        setTopicId(topicIdFromParams);
      });
    } else {
      setLoading(false);
      setTopicId(topicIdFromParams);
    }

    return () => {
      api.cancelRequest();
    };
  }, [fetchTopicDetail, id, messages]);

  const toggleReplyForm = useCallback(() => {
    setShowReplyForm(prev => !prev);
  }, []);

  const renderContent = useCallback(() => {
    const topic = messages[topicId];
    const firstMessage = topic.messages[0];

    return (
      <>
        <Row>
          <Col className="topic-title">
            <span className="h4">{topic.title}</span>
          </Col>
        </Row>
        <ListGroup className="mt-3">
          <MessagePostFragment post={firstMessage} index={0} topic={topic} />
          {topic.messages.slice(1).map((message, index) => (
            <MessagePostFragment key={message.id} post={message} index={index + 1} />
          ))}
        </ListGroup>
        <Row className="mt-3">
          <Col>
            <Button
              color="primary"
              size="sm"
              className="float-right"
              onClick={() => setShowReplyForm(true)}
              style={{ marginRight: '24px' }}
            >
              Reply
            </Button>
          </Col>
        </Row>
        {showReplyForm && (
          <EditMessageForm
            isOpen={showReplyForm}
            toggle={toggleReplyForm}
            initialValues={{ topicId, userId: currentUser.id }}
            formType={Constants.FORM_TYPE.ADD}
          />
        )}
      </>
    );
  }, [messages, topicId, showReplyForm, currentUser.id, toggleReplyForm]);

  const topic = messages[topicId];
  const breadCrumbItems = [{ active: false, text: 'Messages', link: Constants.PATHS.MESSAGES }];
  if (topic) breadCrumbItems.push({ active: true, text: topic.title });

  return (
    <>
      <BreadcrumbFragment>{breadCrumbItems}</BreadcrumbFragment>
      {loading ? <PageSpinner /> : <CardWrapper>{renderContent()}</CardWrapper>}
    </>
  );
};

const mapStateToProps = state => ({
  messages: state.messages,
  currentUser: state.users.all[state.users.current.id],
});

export default connect(mapStateToProps, { fetchTopicDetail })(MessageBoardTopicDetail);
