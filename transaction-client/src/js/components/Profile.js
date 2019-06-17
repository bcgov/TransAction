import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
import _ from 'lodash';

import { fetchTeam, editUser, fetchUser } from '../actions';
import PageSpinner from './ui/PageSpinner';
import UserProfileFragment from './fragments/UserProfileFragment';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import ProfileScoresPanel from './fragments/ProfileScoresPanel';
import UserProfileTeamPanel from './fragments/UserProfileTeamPanel';
import CardWrapper from './ui/CardWrapper';

import * as utils from '../utils';
import * as Constants from '../Constants';

class Profile extends Component {
  state = {
    loading: true,
    userIdToDisplay: null,
    teamIdToDisplay: null,
  };

  componentDidMount() {
    this.init(this.props.match.params.id);
  }

  componentWillReceiveProps(newProps) {
    const currId = newProps.match.params.id;
    const prevId = this.props.match.params.id;
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
    if (utils.isCurrentUserAdmin()) return true;

    return this.selfProfile();
  };

  selfProfile = () => {
    const userId = parseInt(this.props.match.params.id);

    if (!userId) return true;

    if (userId === this.props.currentUser.id) return true;

    return false;
  };

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
                  <UserProfileFragment
                    {..._.pick(teamToDisplay, 'name', 'description')}
                    regionName={this.props.regions[teamToDisplay.regionId].name}
                    profileLink={`${Constants.PATHS.TEAM}/${teamToDisplay.id}`}
                  />
                );
            })()}
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  render() {
    const userToDisplay = this.props.users.all[this.state.userIdToDisplay];

    const breadCrumbItems = [{ active: false, text: 'Profile', link: Constants.PATHS.TEAM }];
    if (userToDisplay) breadCrumbItems.push({ active: true, text: `${userToDisplay.fname} ${userToDisplay.lname}` });

    return (
      <React.Fragment>
        <BreadcrumbFragment>{breadCrumbItems}</BreadcrumbFragment>

        <CardWrapper>
          {this.state.loading ? (
            <PageSpinner />
          ) : (
            userToDisplay && (
              <UserProfileFragment
                canEdit={this.userCanEditProfile()}
                userToDisplay={userToDisplay}
                regionName={this.props.regions[userToDisplay.regionId].name}
              />
            )
          )}
        </CardWrapper>

        {!this.state.loading && (
          <CardWrapper>
            <UserProfileTeamPanel
              selfProfile={this.selfProfile()}
              teamIdToDisplay={this.state.teamIdToDisplay}
              userIdToDisplay={this.state.userIdToDisplay}
            />
          </CardWrapper>
        )}

        {!this.state.loading && this.selfProfile() && (
          <CardWrapper>
            <ProfileScoresPanel
              userIdToDisplay={this.state.userIdToDisplay}
              teamIdToDisplay={this.state.teamIdToDisplay}
            />
          </CardWrapper>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.all[state.users.current.id],
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
