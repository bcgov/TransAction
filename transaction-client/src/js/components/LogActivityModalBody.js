import React, { Component } from 'react';
//import _ from 'lodash';
import { connect } from 'react-redux';
import LogActivityModalForm from './LogActivityModalForm';
import { createUserActivity, fetchActivityList, fetchCurrentUser, fetchUserScore, fetchTeamScore } from '../actions';

class LogActivityModalBody extends Component {
  onSubmit = formValues => {
    if (!formValues.activityId) {
      const activityId = { activityId: this.props.activityList[1].id };
      formValues = { ...formValues, ...activityId };
      console.log('nothing chosen, defaulted to first pick', activityId);
    }
    console.log(formValues);
    const activityObj = {
      eventId: this.props.eventId,
      ...formValues,
      userId: this.props.currentUser.id,
      concurrencyControlNumber: 1,
      description: 'description1',
      name: 'name1',
      teamId: this.props.currentUser.teamId,
    };
    this.props.createUserActivity(activityObj).then(() => {
      this.props.fetchCurrentUser();
      this.props.fetchUserScore(this.props.currentUser.id, this.props.eventId);
      this.props.fetchTeamScore(this.props.currentUser.teamId, this.props.eventId);
    });
    this.props.modalClose();
  };

  componentDidMount() {
    Promise.all([this.props.fetchCurrentUser(), this.props.fetchActivityList()]).then(() => {});
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
  { createUserActivity, fetchCurrentUser, fetchActivityList, fetchUserScore, fetchTeamScore }
)(LogActivityModalBody);
