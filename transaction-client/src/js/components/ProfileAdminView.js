import React, { Component } from 'react';
import ProfileOfficeForm from './ProfileOfficeForm.js';
import _ from 'lodash';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spinner, Button } from 'reactstrap';
import {
  fetchCurrentUser,
  fetchTeam,
  editUser,
  fetchRegions,
  fetchAllUserScores,
  fetchEvents,
  fetchRoles,
  fetchUser,
  fetchCurrentTeam,
} from '../actions';
import DescriptionForm from './DescriptionForm';

class Profile extends Component {
  state = { loading: true, modal: false };
  toggleSpinner = () => {
    this.setState(prevState => ({
      loading: !prevState.loading,
    }));
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  decideRender() {
    if (this.state.loading) {
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    } else {
      return this.userInfo();
    }
  }

  componentDidMount() {
    // this.toggleSpinner();
    this.props
      .fetchUser(this.props.userId)
      .then(() => {
        Promise.all([
          this.props.fetchRegions(),
          this.props.fetchTeam(this.props.user.teamId),
          this.props.fetchCurrentTeam(this.props.currentUser.teamId),
        ])
          .then(() => {
            this.toggleSpinner();
          })
          .catch(() => {
            this.toggleSpinner();
          });
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

  onSubmit = formValues => {
    const userObj = { ...this.props.user, ...formValues };

    this.props.editUser(userObj, this.props.user.id);
  };

  leaveTeam = () => {
    const leaveAlert = window.confirm('Do you really want to leave the team?');
    if (leaveAlert === true) {
      const team = { teamId: null };
      this.onSubmit(team);
    }
  };

  //TODO Button logic
  printTeam = () => {
    if (this.props.user.teamId !== null) {
      return (
        <h3 className="mt-3">
          Team: {this.props.currentTeam.name}
          <Link to="/team">
            <Button color="primary" className="ml-3 mb-2">
              Visit Team
            </Button>
          </Link>
          <Button color="secondary" className="ml-3 mb-2" onClick={this.leaveTeam}>
            {' '}
            Remove From Team
          </Button>
        </h3>
      );
    } else {
      return <h3 className="mt-3">Team: No Team!</h3>;
    }
  };

  userInfo() {
    return (
      <div>
        <h3>
          Name: {this.props.user.fname} {this.props.user.lname}{' '}
        </h3>
        <h3>
          <ProfileOfficeForm
            initialValues={_.pick(this.props.user, 'regionId')}
            userRegion={this.props.user.regionId}
            regions={this.props.regions}
            onSubmit={this.onSubmit}
          />
        </h3>
        {this.printTeam()}
        <DescriptionForm initialValues={_.pick(this.props.user, 'description')} onSubmit={this.onSubmit} />
      </div>
    );
  }

  render() {
    return <div>{this.decideRender()}</div>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.currentUser,
    user: state.users[ownProps.userId],
    team: state.team,
    regions: Object.values(state.regions),
    allUserScores: Object.values(state.allUserScores),
    events: Object.values(state.events),
    roles: state.roles,
    currentTeam: state.currentTeam,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchCurrentUser,
    fetchUser,
    fetchTeam,
    editUser,
    fetchRegions,
    fetchAllUserScores,
    fetchEvents,
    fetchRoles,
    fetchCurrentTeam,
  }
)(Profile);
