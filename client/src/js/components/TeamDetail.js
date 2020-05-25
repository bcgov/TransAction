import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { fetchCurrentUser, fetchTeam, editTeam, fetchUser, editUser, fetchSpecificTeamRequests } from '../actions';
import PageSpinner from './ui/PageSpinner';

import TeamProfileFragment from './fragments/TeamProfileFragment';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import TeamJoinRequestPanel from './fragments/TeamJoinRequestPanel';
import TeamMembersPanel from './fragments/TeamMembersPanel';
import ProfileScoresPanel from './fragments/ProfileScoresPanel';
import CardWrapper from './ui/CardWrapper';

import * as api from '../api/api';
import * as utils from '../utils';
import * as Constants from '../Constants';

class Team extends Component {
  state = {
    loading: true,
    teamIdToDisplay: null,
  };

  componentDidMount() {
    api.resetCancelTokenSource();
    this.init(this.props.match.params.id);
  }

  componentWillUnmount() {
    api.cancelRequest();
  }

  componentDidUpdate(prevProps) {
    // Re-init if URL param has changed
    const prevId = prevProps.match.params.id;
    const currId = this.props.match.params.id;
    if (currId !== prevId) {
      this.init(currId);
    }
  }

  init = teamId => {
    this.setState({ loading: true });

    teamId = parseInt(teamId);

    this.props
      .fetchTeam(teamId)
      .then(() => {
        const team = this.props.teams[teamId];

        if (team) this.setState({ teamIdToDisplay: team.id });

        let usersToFetch = team.teamMemberIds.filter(userId => {
          return !(userId in this.props.users);
        });

        return Promise.all(
          usersToFetch.map(user => {
            return this.props.fetchUser(user);
          })
        );
      })
      .then(() => {
        this.setState({ loading: false });
      });
  };

  userIsTeamleadOrAdmin = () => {
    const team = this.props.teams[this.state.teamIdToDisplay];
    const currentUser = this.props.currentUser;

    if (!team) return false;

    return utils.isCurrentUserAdmin() || team.teamLeaderId === currentUser.id;
  };

  userIsTeamlead = () => {
    const team = this.props.teams[this.state.teamIdToDisplay];
    const currentUser = this.props.currentUser;

    if (!team) return false;

    return team.teamLeaderId === currentUser.id;
  };

  userBelongsToTeam = () => {
    if (!this.props.currentUser.teamId) return false;
    return this.state.teamIdToDisplay === this.props.currentUser.teamId;
  };

  render() {
    const teamToDisplay = this.props.teams[this.state.teamIdToDisplay];

    const breadCrumbItems = [{ active: false, text: 'Teams', link: Constants.PATHS.TEAM }];
    if (teamToDisplay) breadCrumbItems.push({ active: true, text: teamToDisplay.name });

    return (
      <React.Fragment>
        <BreadcrumbFragment>{breadCrumbItems}</BreadcrumbFragment>

        <CardWrapper>
          {this.state.loading ? (
            <PageSpinner />
          ) : (
            <TeamProfileFragment
              canEdit={this.userIsTeamleadOrAdmin()}
              team={teamToDisplay}
              regionName={this.props.regions[teamToDisplay.regionId].name}
            />
          )}
        </CardWrapper>

        <CardWrapper>
          <Row className="mb-3">
            <Col>
              <h4>Team Members</h4>
            </Col>
          </Row>
          {this.state.loading ? (
            <PageSpinner />
          ) : (
            <TeamMembersPanel
              teamToDisplay={teamToDisplay}
              users={this.props.users}
              regions={this.props.regions}
              currentUser={this.props.currentUser}
            />
          )}
        </CardWrapper>

        {teamToDisplay && this.userIsTeamlead() && teamToDisplay.numMembers < 5 && (
          <TeamJoinRequestPanel team={teamToDisplay} />
        )}

        {this.userBelongsToTeam() && teamToDisplay && (
          <CardWrapper>
            <ProfileScoresPanel
              userIdToDisplay={this.props.currentUser.id}
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
    scores: state.scores,
    teams: state.teams,
    users: state.users.all,
    roles: state.roles,
    joinRequests: Object.values(state.joinRequests),
    regions: state.regions,
    events: state.events,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchCurrentUser,
    fetchTeam,
    editTeam,
    fetchUser,
    fetchSpecificTeamRequests,
    editUser,
  }
)(Team);
