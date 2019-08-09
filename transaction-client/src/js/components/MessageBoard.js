import React from 'react';
import { connect } from 'react-redux';
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

import * as Constants from '../Constants';

class MessageBoard extends React.Component {
  state = { loading: true, showEditTopicForm: false, searchTerm: undefined, page: 0, pageSize: 10, pageCount: 1 };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const nextPage = this.state.page + 1;
    if (this.state.page < this.state.pageCount) {
      this.props.fetchTopics(this.state.searchTerm, nextPage, this.state.pageSize).then(pageCount => {
        this.setState({ loading: false, page: nextPage, pageCount });
      });
    }
  };

  showEditTopicForm = () => {
    this.setState({ showEditTopicForm: true });
  };

  toggleEditTopicForm = () => {
    this.setState(prevState => ({
      showEditTopicForm: !prevState.showEditTopicForm,
    }));
  };

  renderContent() {
    const { topics } = this.props;

    if (topics.length === 0) return <Alert color="primary">There are no posts at the moment.</Alert>;

    return (
      <React.Fragment>
        <ScrollLoader loader={this.loadData} page={this.state.page} pageCount={this.state.pageCount}>
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
                          by <Link to={`${Constants.PATHS.PROFILE}/${topic.userId}`}>{topic.userName}</Link> >>{' '}
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
  }

  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment>{[{ active: true, text: 'Messages' }]}</BreadcrumbFragment>
        {this.state.loading ? (
          <PageSpinner />
        ) : (
          <CardWrapper>
            <h4>Message Board</h4>
            <div className="text-right">
              <Button size="sm" color="primary" className="mb-3" onClick={this.showEditTopicForm}>
                New Thread
              </Button>
            </div>
            {this.renderContent()}
          </CardWrapper>
        )}
        {this.state.showEditTopicForm && (
          <EditTopicForm
            isOpen={this.state.showEditTopicForm}
            toggle={this.toggleEditTopicForm}
            formType={Constants.FORM_TYPE.ADD}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    topics: _.orderBy(Object.values(state.messages), ['lastMessageTimestamp'], ['desc']),
  };
};

export default connect(
  mapStateToProps,
  { fetchTopics }
)(MessageBoard);
