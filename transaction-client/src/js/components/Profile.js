import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { BreadcrumbItem, Button, Row, Col, Alert } from 'reactstrap';
import _ from 'lodash';

import { fetchTeam, editUser, fetchUser } from '../actions';
import PageSpinner from './ui/PageSpinner';
import EditUserForm from './forms/EditUserForm';
import ProfileFragment from './fragments/ProfileFragment';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import ProfileScoresPanel from './fragments/ProfileScoresPanel';
import ProfileTeamPanel from './fragments/ProfileTeamPanel';

import * as Constants from '../Constants';

class Profile extends Component {
  state = {
    loading: true,
    userIdToDisplay: null,
    teamIdToDisplay: null,
    showEditUserForm: false,
    showEditTeamForm: false,
  };

  componentDidMount() {
    this.init(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    // Re-init if URL param has changed
    const prevId = prevProps.match.params.id;
    const currId = this.props.match.params.id;
    if (currId !== prevId && parseInt(prevId) !== this.props.currentUser.id) {
      this.init(currId);
    }
  }

  init = userId => {
    this.setState({ loading: true });

    userId = parseInt(userId);

    if (isNaN(userId)) userId = this.props.currentUser.id;
    this.props
      .fetchUser(userId)
      .then(() => {
        const teamId = this.props.users.all[userId].teamId;
        this.setState({ userIdToDisplay: userId, teamIdToDisplay: teamId });

        if (teamId) return this.props.fetchTeam(teamId);
        else return Promise.resolve();
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(e => {
        //this.setState({ loading: false });
        console.error(e);
      });
  };

  userCanEditProfile = () => {
    if (this.props.currentUser.isAdmin) return true;

    return this.selfProfile();
  };

  selfProfile = () => {
    const userId = parseInt(this.props.match.params.id);

    if (!userId) return true;

    if (userId === this.props.currentUser.id) return true;

    return false;
  };

  showEditUserForm = () => {
    this.setState({ showEditUserForm: true });
  };

  toggleEditUserForm = () => {
    this.setState(prevState => ({
      showEditUserForm: !prevState.showEditUserForm,
    }));
  };

  renderUserInfo() {
    const userToDisplay = this.props.users.all[this.state.userIdToDisplay];

    return (
      <React.Fragment>
        <ProfileFragment
          name={`${userToDisplay.fname} ${userToDisplay.lname}`}
          description={userToDisplay.description}
          regionName={this.props.regions[userToDisplay.regionId].name}
        />
        <hr />
      </React.Fragment>
    );
  }

  renderUserTeam() {
    const teamToDisplay = this.props.teams[this.state.teamIdToDisplay];
    const userToDisplay = this.props.users.all[this.state.userIdToDisplay];

    return (
      <React.Fragment>
        <Row>
          <Col>
            {(() => {
              if (!teamToDisplay) {
                if (this.selfProfile())
                  return (
                    <Alert color="warning">
                      You are not currently on a team. Get started <Link to={Constants.PATHS.START}>here</Link>.
                    </Alert>
                  );
                else return <p>{userToDisplay.fname} is not part of a team.</p>;
              } else
                return (
                  <ProfileFragment
                    {..._.pick(teamToDisplay, 'name', 'description')}
                    regionName={this.props.regions[teamToDisplay.regionId].name}
                    profileLink={`${Constants.PATHS.TEAM}/${teamToDisplay.id}`}
                  />
                );
            })()}
          </Col>
        </Row>
        <hr />
      </React.Fragment>
    );
  }

  render() {
    const userToDisplay = this.props.users.all[this.state.userIdToDisplay];

    return (
      <React.Fragment>
        <BreadcrumbFragment>
          <BreadcrumbItem>
            <Link to="/profile">Profile</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>{userToDisplay && `${userToDisplay.fname} ${userToDisplay.lname}`}</BreadcrumbItem>
        </BreadcrumbFragment>

        <Row className="mb-3">
          <Col xs="2">
            <h4>User Profile</h4>
          </Col>
          <Col>
            {this.userCanEditProfile() && userToDisplay && !this.state.loading && (
              <Button color="primary" size="sm" onClick={this.showEditUserForm}>
                Edit Profile
              </Button>
            )}
          </Col>
        </Row>
        {this.state.loading ? <PageSpinner /> : this.renderUserInfo()}

        {!this.state.loading && (
          <ProfileTeamPanel
            selfProfile={this.selfProfile()}
            teamIdToDisplay={this.state.teamIdToDisplay}
            userIdToDisplay={this.state.userIdToDisplay}
          />
        )}

        {!this.state.loading && this.selfProfile() && (
          <ProfileScoresPanel
            userIdToDisplay={this.state.userIdToDisplay}
            teamIdToDisplay={this.state.teamIdToDisplay}
          />
        )}

        <EditUserForm
          initialValues={userToDisplay}
          isOpen={this.state.showEditUserForm}
          toggle={this.toggleEditUserForm}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.current,
    users: state.users,
    regions: state.regions,
    roles: state.roles,
    teams: state.teams,
    events: state.events,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchUser,
    fetchTeam,
    editUser,
  }
)(Profile);
