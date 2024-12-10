import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Table, Button } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';

import { fetchTopics } from '../actions';
import PageSpinner from './ui/PageSpinner';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import EditTopicForm from './forms/EditTopicForm';
import ScrollLoader from './fragments/ScollLoader';

import * as api from '../api/api';
import * as Constants from '../Constants';

const MessageBoard = () => {
  const [loading, setLoading] = useState(true);
  const [showEditTopicForm, setShowEditTopicForm] = useState(false);
  const [searchTerm] = useState(undefined);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);

  const dispatch = useDispatch();
  const topics = useSelector(state => 
    _.orderBy(Object.values(state.messages), ['lastMessageTimestamp'], ['desc'])
  );
  
  const loadData = useCallback(() => {
    const nextPage = page + 1;
    if (page < pageCount) {
      dispatch(fetchTopics(searchTerm, nextPage, pageSize)).then(newPageCount => {
        setLoading(false);
        setPage(nextPage);
        setPageCount(newPageCount);
      });
    }
  }, [page, pageCount, searchTerm, pageSize, dispatch]);

  useEffect(() => {
    api.resetCancelTokenSource();
    loadData();
    return () => {
      api.cancelRequest();
    };
  }, [loadData]); // Runs only once on component mount/unmount

  const toggleEditTopicForm = () => {
    setShowEditTopicForm(prev => !prev);
  };

  const renderContent = () => {
    if (topics.length === 0) {
      return <Alert color="primary">There are no posts at the moment.</Alert>;
    }

    return (
      <React.Fragment>
        <ScrollLoader loader={loadData} page={page} pageCount={pageCount}>
          <Table size="sm" bordered responsive>
            <thead className="thead-dark">
              <tr>
                <th>Topics</th>
                <th>Replies</th>
                <th>Last Post</th>
              </tr>
            </thead>
            <tbody>
              {topics.map(topic => {
                const lastMessage = topic.messages[topic.messages.length - 1];
                const postTime = moment(topic.dbCreateTimestamp);
                const lastUpdateTime = moment(lastMessage.dbCreateTimestamp);
                return (
                  <tr key={topic.id}>
                    <td>
                      <div>
                        <strong>
                          <Link to={`${Constants.PATHS.MESSAGES}/${topic.id}`}>{topic.title}</Link>
                        </strong>
                      </div>
                      <div>
                        <small>
                          by <Link to={`${Constants.PATHS.PROFILE}/${topic.userId}`}>{topic.userName}</Link> {' '}
                          {postTime.format(Constants.MESSAGE_DATE_FORMAT)}
                        </small>
                      </div>
                    </td>
                    <td>{topic.postCount}</td>

                    <td>
                      <small>
                        by <Link to={`${Constants.PATHS.PROFILE}/${lastMessage.userId}`}>{lastMessage.userName}</Link>
                        <br />
                        {lastUpdateTime.format(Constants.MESSAGE_DATE_FORMAT)}
                      </small>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </ScrollLoader>
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      <BreadcrumbFragment>{[{ active: true, text: 'Messages' }]}</BreadcrumbFragment>
      {loading ? (
        <PageSpinner />
      ) : (
        <CardWrapper>
          <h4>Message Board</h4>
          <div className="text-right">
            <Button size="sm" color="primary" className="mb-3" onClick={() => setShowEditTopicForm(true)}>
              New Thread
            </Button>
          </div>
          {renderContent()}
        </CardWrapper>
      )}
      {showEditTopicForm && (
        <EditTopicForm
          isOpen={showEditTopicForm}
          toggle={toggleEditTopicForm}
          formType={Constants.FORM_TYPE.ADD}
        />
      )}
    </React.Fragment>
  );
};

export default MessageBoard;
