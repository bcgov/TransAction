import React, { Component } from 'react';
//import _ from 'lodash';
import { connect } from 'react-redux';
import CreateTeamModalForm from './CreateTeamModalForm';
import { createTeam, fetchCurrentUser } from '../actions';

class CreateTeamModalBody extends Component {
  onSubmit = formValues => {
    //TODO hardcoded values, need to make flexible
    const teamObj = {
      ...formValues,
      concurrencyControlNumber: 1,
      regionId: this.props.currentUser.regionId,
      userId: this.props.currentUser.id,
    };

    this.props.createTeam(teamObj).then(() => {
      this.props.fetchCurrentUser();
    });
    this.props.modalClose();
  };

  componentDidMount() {
    Promise.all([this.props.fetchCurrentUser()]);
  }

  decideRender() {
    return <CreateTeamModalForm onSubmit={this.onSubmit} modalClose={this.props.modalClose} name={this.props.name} />;
  }

  render() {
    return <div>{this.decideRender()}</div>;
  }
}

const mapStateToProps = state => {
  return { currentUser: state.currentUser };
};

export default connect(
  mapStateToProps,
  { createTeam, fetchCurrentUser }
)(CreateTeamModalBody);
