import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BreadcrumbItem, Table } from 'reactstrap';

import { fetchTopics } from '../actions';
import PageSpinner from './ui/PageSpinner';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as Constants from '../Constants';

class MessageBoard extends React.Component {
  state = { loading: true };
  componentDidMount() {
    this.props.fetchTopics().then(() => {
      this.setState({ loading: false });
    });
  }

  renderContent() {
    const { messages } = this.props;

    return (
      <React.Fragment>
        <h4>Message Board</h4>
        <Table size="sm" hover borderless responsive className="mt-3">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Author</th>
              <th>Posts</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(message => {
              return (
                <tr key={message.id}>
                  <td>
                    <Link to={`${Constants.PATHS.MESSAGES}/${message.id}`}>{message.title}</Link>
                  </td>
                  <td>
                    <Link to={`${Constants.PATHS.PROFILE}/${message.userId}`}>{message.userName}</Link>
                  </td>
                  <td>{message.postCount}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment>
          <BreadcrumbItem>Messages</BreadcrumbItem>
        </BreadcrumbFragment>
        {this.state.loading ? <PageSpinner /> : <CardWrapper>{this.renderContent()}</CardWrapper>}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: Object.values(state.messages),
  };
};

export default connect(
  mapStateToProps,
  { fetchTopics }
)(MessageBoard);
