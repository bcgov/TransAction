import React, { Component } from 'react';
//import _ from 'lodash';
import { connect } from 'react-redux';
import LogActivityModalForm from './LogActivityModalForm';
import { createUserActivity, fetchActivityList, fetchCurrentUser } from '../actions';

class LogActivityModalBody extends Component {
  onSubmit = formValues => {
    const activityObj = {
      eventId: this.props.eventId,
      ...formValues,
      userId: this.props.currentUser.userId,
      concurrencyControlNumber: 1,
      description: null,
      name: null,
    };
    this.props.createUserActivity(activityObj).then(() => {
      this.props.fetchCurrentUser('me');
    });
    this.props.modalClose();
  };

  componentDidMount() {
    Promise.all([this.props.fetchCurrentUser('me'), this.props.fetchActivityList()]);
  }

  decideRender() {
    return (
      <LogActivityModalForm
        onSubmit={this.onSubmit}
        modalClose={this.props.modalClose}
        name={this.props.name}
        activityList={this.props.activityList}
      />
    );
  }

  render() {
    return <div>{this.decideRender()}</div>;
  }
}

const mapStateToProps = state => {
  return { currentUser: state.currentUser, activityList: Object.values(state.activities) };
};

export default connect(
  mapStateToProps,
  { createUserActivity, fetchCurrentUser, fetchActivityList }
)(LogActivityModalBody);
