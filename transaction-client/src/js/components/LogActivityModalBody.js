import React, { Component } from 'react';
//import _ from 'lodash';
import { connect } from 'react-redux';
import LogActivityModalForm from './LogActivityModalForm';
import { createUserActivity, fetchActivityList, fetchUser } from '../actions';

class CreateTeamModalBody extends Component {
  onSubmit = formValues => {
    const activityObj = { eventId: this.props.eventId, ...formValues, userId: this.props.user.userId };
    console.log('adding:', activityObj);
    this.props.createUserActivity(activityObj).then(() => {
      this.props.fetchUser('me');
    });
    this.props.modalClose();
  };

  componentDidMount() {
    Promise.all([this.props.fetchUser('me'), this.props.fetchActivityList()]);
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
  return { user: state.user, activityList: Object.values(state.activities) };
};

export default connect(
  mapStateToProps,
  { createUserActivity, fetchUser, fetchActivityList }
)(CreateTeamModalBody);
