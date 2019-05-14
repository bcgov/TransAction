import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Breadcrumb, BreadcrumbItem, Button, Row, Col } from 'reactstrap';
import _ from 'lodash';

import {
  fetchCurrentUser,
  fetchTeam,
  editTeam,
  fetchUsers,
  editUser,
  fetchSpecificTeamRequests,
  editJoinRequest,
  fetchAllTeamScores,
  fetchAllUserScores,
  fetchEvents,
} from '../actions';
import PageSpinner from './ui/PageSpinner';
import ProfileFragment from './ui/ProfileFragment';
import TeamMemberRow from './ui/TeamMemberRow';
import UserScoreCard from './ui/UserScoreCard';
import EditTeamForm from './forms/EditTeamForm';
import LogActivityForm from './forms/LogActivityForm';

import * as Constants from '../Constants';

class Team extends Component {
  state = {
    loading: true,
    canEdit: false,
    ownTeamProfile: false,
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

    this.setState({ loading: true, canEdit: false, ownTeamProfile: false });

    if (currentUser.isAdmin) this.setState({ canEdit: true });

    teamId = parseInt(teamId);

    Promise.all([
      this.props.fetchTeam(teamId),
      this.props.fetchUsers(),
      this.props.fetchSpecificTeamRequests(teamId),
      this.props.fetchAllTeamScores(teamId),
      this.props.fetchAllUserScores(currentUser.id),
      this.props.fetchEvents(),
    ])
      .then(() => {
        const team = this.props.teams[teamId];

        // If team lead
        if (!team && team.teamLeaderId === currentUser.id) this.setState({ canEdit: true });

        if (currentUser.teamId === teamId) this.setState({ ownTeamProfile: true });

        this.setState({ teamIdToDisplay: teamId, loading: false });
      })
      .catch(() => {});
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

  renderTeamMembers(teamToDisplay) {
    const users = this.props.users;
    const regions = this.props.regions;
    const currentUser = this.props.currentUser;

    const teamMemberElements = users
      .filter(user => {
        return user.teamId === teamToDisplay.id;
      })
      .map(user => {
        return (
          <TeamMemberRow key={user.id} user={user} regions={regions}>
            <React.Fragment>
              {user.id === currentUser.id ? (
                <Button color="danger" size="sm" className="w75">
                  Leave
                </Button>
              ) : (
                currentUser.id === teamToDisplay.teamLeaderId && (
                  <Button color="danger" size="sm" className="w75">
                    Remove
                  </Button>
                )
              )}
            </React.Fragment>
          </TeamMemberRow>
        );
      });

    return (
      <React.Fragment>
        <Row className="mb-2">
          <Col xs="6" lg="4">
            <strong>Name</strong>
          </Col>
          <Col xs="3" lg="4">
            <strong>Region</strong>
          </Col>
          <Col xs="3" lg="4" />
        </Row>
        {teamMemberElements}
        <hr />
      </React.Fragment>
    );
  }

  renderTeamJoinRequests(teamToDisplay) {
    const users = this.props.users;
    const regions = this.props.regions;
    const joinRequestsUserIds = this.props.joinRequests
      .filter(request => {
        return request.teamId === teamToDisplay.id;
      })
      .map(request => {
        return request.userId;
      });

    const teamMemberElements = users
      .filter(user => {
        return joinRequestsUserIds.includes(user.id);
      })
      .map(user => {
        return (
          <TeamMemberRow key={user.id} user={user} regions={regions}>
            <React.Fragment>
              <Button color="success" size="sm" className="w75 mr-1">
                Accept
              </Button>
              <Button color="danger" size="sm" className="w75">
                Reject
              </Button>
            </React.Fragment>
          </TeamMemberRow>
        );
      });

    return (
      <React.Fragment>
        <Row className="mb-2">
          <Col xs="6" lg="4">
            <strong>Name</strong>
          </Col>
          <Col xs="3" lg="4">
            <strong>Region</strong>
          </Col>
          <Col xs="3" lg="4" />
        </Row>
        {teamMemberElements}
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

    return (
      <React.Fragment>
        <Row>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/team">Teams</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{teamToDisplay && teamToDisplay.name}</BreadcrumbItem>
          </Breadcrumb>
        </Row>
        <Row className="mb-3">
          <Col xs="2">
            <h4>Team Profile</h4>
          </Col>
          <Col>
            {this.state.canEdit && teamToDisplay && !this.state.loading && (
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
        {this.state.loading ? <PageSpinner /> : this.renderTeamMembers(teamToDisplay)}

        {teamToDisplay && this.props.currentUser.id === teamToDisplay.teamLeaderId && (
          <React.Fragment>
            <Row className="mb-3">
              <Col>
                <h4>Team Join Requests</h4>
              </Col>
            </Row>
            {this.state.loading ? <PageSpinner /> : this.renderTeamJoinRequests(teamToDisplay)}
          </React.Fragment>
        )}

        {this.state.ownTeamProfile && (
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
    users: Object.values(state.users.all),
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
    fetchUsers,
    fetchSpecificTeamRequests,
    editUser,
    editJoinRequest,
    fetchAllTeamScores,
    fetchAllUserScores,
    fetchEvents,
  }
)(Team);
