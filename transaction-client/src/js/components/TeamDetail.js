import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, BreadcrumbItem, Button, Row, Col } from 'reactstrap';
import _ from 'lodash';

import {
  fetchCurrentUser,
  fetchTeam,
  editTeam,
  fetchUser,
  editUser,
  fetchSpecificTeamRequests,
  editJoinRequest,
  fetchAllTeamScores,
  fetchAllUserScores,
  fetchEvents,
} from '../actions';
import PageSpinner from './ui/PageSpinner';

import ProfileFragment from './fragments/ProfileFragment';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import UserScoreCard from './fragments/UserScoreCard';
import TeamJoinRequestPanel from './fragments/TeamJoinRequestPanel';
import TeamMembersPanel from './fragments/TeamMembersPanel';

import EditTeamForm from './forms/EditTeamForm';
import LogActivityForm from './forms/LogActivityForm';

import * as Constants from '../Constants';

class Team extends Component {
  state = {
    loading: true,
    teamIdToDisplay: null,
    showEditTeamForm: false,
    showLogActivityForm: false,
    logActivityEventId: null,
  };

  componentDidMount() {
    this.init(this.props.match.params.id);
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
    const currentUser = this.props.currentUser;

    this.setState({ loading: true });

    teamId = parseInt(teamId);

    Promise.all([this.props.fetchTeam(teamId), this.props.fetchSpecificTeamRequests(teamId)])
      .then(() => {
        const team = this.props.teams[teamId];
        const joinRequest = this.props.joinRequests;

        if (team) this.setState({ teamIdToDisplay: team.id });

        let apiActions = [];

        if (this.userBelongsToTeam()) {
          apiActions = [
            { action: this.props.fetchAllTeamScores, param: teamId },
            { action: this.props.fetchAllUserScores, param: currentUser.id },
            { action: this.props.fetchEvents, param: null },
          ];
        }

        if (this.userBelongsToTeam() && this.userIsTeamleadOrAdmin())
          apiActions.push({ action: this.props.fetchSpecificTeamRequests, param: teamId });

        let usersToFetch = team.teamMemberIds.filter(userId => {
          return !(userId in this.props.users);
        });

        usersToFetch = usersToFetch.concat(
          joinRequest.map(request => {
            return request.userId;
          })
        );

        usersToFetch.forEach(user => {
          apiActions.push({ action: this.props.fetchUser, param: user });
        });

        return Promise.all(
          apiActions.map(action => {
            return action.action(action.param);
          })
        );
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(e => {
        console.error(e);
      });
  };

  userIsTeamleadOrAdmin = () => {
    const team = this.props.teams[this.state.teamIdToDisplay];
    const currentUser = this.props.currentUser;

    if (!team) return false;

    return currentUser.isAdmin || team.teamLeaderId === currentUser.id;
  };

  userBelongsToTeam = () => {
    if (!this.props.currentUser.teamId) return false;
    return this.state.teamIdToDisplay === this.props.currentUser.teamId;
  };

  showLogActivityForm = eventId => {
    this.setState({ showLogActivityForm: true, logActivityEventId: eventId });
  };

  toggleLogActivityForm = () => {
    this.setState(prevState => ({
      showLogActivityForm: !prevState.showLogActivityForm,
    }));
  };

  showEditTeamForm = () => {
    this.setState({ showEditTeamForm: true });
  };

  toggleEditTeamForm = () => {
    this.setState(prevState => ({
      showEditTeamForm: !prevState.showEditTeamForm,
    }));
  };

  renderTeamInfo(teamToDisplay) {
    return (
      <React.Fragment>
        <ProfileFragment
          {..._.pick(teamToDisplay, 'name', 'description', 'goal')}
          regionName={this.props.regions[teamToDisplay.regionId].name}
        />
        <hr />
      </React.Fragment>
    );
  }

  renderTeamScores() {
    const events = this.props.events;
    const scores = this.props.scores;
    const currentUser = this.props.currentUser;
    const currentTeam = this.props.teams[this.state.teamIdToDisplay];

    const teamScores = Object.values(scores.team[this.state.teamIdToDisplay]);
    const userScores = scores.user[currentUser.id];

    const teamScoreCards = teamScores.map(score => {
      const userScore = userScores[score.eventId];
      return (
        <Col xs="12" lg="6" key={score.eventId} className="mb-3">
          <UserScoreCard
            score={userScore}
            teamScore={score}
            event={events[score.eventId]}
            cardWidth={Constants.USER_SCORE_CARD_WIDTH.NARROW}
            showLogActivityForm={this.showLogActivityForm}
            goal={currentTeam.goal}
          />
        </Col>
      );
    });

    return (
      <Row className="mb-5">
        {teamScoreCards.length > 0 ? (
          teamScoreCards
        ) : (
          <Col>
            <Alert color="warning">
              Your team has not participated in any events yet. Click <Link>here</Link> to see a list of active events.
            </Alert>
          </Col>
        )}
      </Row>
    );
  }

  render() {
    const teamToDisplay = this.props.teams[this.state.teamIdToDisplay];
    const joinRequests = this.props.joinRequests.filter(request => {
      return request.teamId === this.state.teamIdToDisplay;
    });

    return (
      <React.Fragment>
        <BreadcrumbFragment>
          <BreadcrumbItem>
            <Link to="/team">Teams</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>{teamToDisplay && teamToDisplay.name}</BreadcrumbItem>
        </BreadcrumbFragment>
        <Row className="mb-3">
          <Col xs="2">
            <h4>Team Profile</h4>
          </Col>
          <Col>
            {this.userIsTeamleadOrAdmin() && teamToDisplay && !this.state.loading && (
              <Button color="primary" size="sm" onClick={this.showEditTeamForm}>
                Edit Team
              </Button>
            )}
          </Col>
        </Row>
        {this.state.loading ? <PageSpinner /> : this.renderTeamInfo(teamToDisplay)}

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

        {teamToDisplay &&
          this.props.currentUser.id === teamToDisplay.teamLeaderId &&
          joinRequests.length > 0 &&
          teamToDisplay.numMembers < 5 && (
            <React.Fragment>
              <Row className="mb-3">
                <Col>
                  <h4>Team Join Requests</h4>
                </Col>
              </Row>
              {this.state.loading ? <PageSpinner /> : <TeamJoinRequestPanel teamToDisplay={teamToDisplay} />}
            </React.Fragment>
          )}

        {this.userBelongsToTeam() && (
          <React.Fragment>
            <Row className="mb-3">
              <Col>
                <h4>Activity</h4>
              </Col>
            </Row>
            {this.state.loading ? <PageSpinner /> : this.renderTeamScores()}
          </React.Fragment>
        )}

        <EditTeamForm
          initialValues={teamToDisplay}
          isOpen={this.state.showEditTeamForm}
          toggle={this.toggleEditTeamForm}
          formType={Constants.FORM_TYPE.EDIT}
        />
        <LogActivityForm
          isOpen={this.state.showLogActivityForm}
          toggle={this.toggleLogActivityForm}
          eventId={this.state.logActivityEventId}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.current,
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
    editJoinRequest,
    fetchAllTeamScores,
    fetchAllUserScores,
    fetchEvents,
  }
)(Team);
