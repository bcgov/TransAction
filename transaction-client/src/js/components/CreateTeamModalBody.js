import React, { Component } from 'react';
//import _ from 'lodash';
import { connect } from 'react-redux';
import CreateTeamModalForm from './CreateTeamModalForm';
import { createTeam, editUser, fetchTeam, fetchUser } from '../actions';

class CreateTeamModalBody extends Component {
  onSubmit = formValues => {
    //TODO hardcoded values, need to make flexible
    const teamObj = { progressamt: 50, progressbar: true, ...formValues };

    this.props.createTeam(teamObj).then(() => {
      this.props.fetchUser('me');
    });
    this.props.modalClose();
  };

  componentDidMount() {
    Promise.all([this.props.fetchUser('me')]);
  }

  decideRender() {
    return <CreateTeamModalForm onSubmit={this.onSubmit} modalClose={this.props.modalClose} name={this.props.name} />;
  }

  render() {
    return <div>{this.decideRender()}</div>;
  }
}

const mapStateToProps = state => {
  return { user: state.user };
};

export default connect(
  mapStateToProps,
  { createTeam, fetchUser, editUser, fetchTeam }
)(CreateTeamModalBody);
