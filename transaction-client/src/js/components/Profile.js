import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { BreadcrumbItem, Button, Row, Col, Alert } from 'reactstrap';
import _ from 'lodash';

import { fetchTeam, editUser, fetchAllUserScores, fetchUser, fetchEvents, fetchAllTeamScores } from '../actions';
import PageSpinner from './ui/PageSpinner';
import EditUserForm from './forms/EditUserForm';
import LogActivityForm from './forms/LogActivityForm';
import UserScoreCard from './fragments/UserScoreCard';
import ProfileFragment from './fragments/ProfileFragment';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as Constants from '../Constants';

class Profile extends Component {
  state = {
    loading: true,
    canEdit: false,
    ownProfile: false,
    userIdToDisplay: null,
    teamIdToDisplay: null,
    showEditUserForm: false,
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
    if (currId !== prevId && parseInt(prevId) !== this.props.currentUser.id) {
      this.init(currId);
    }
  }

  init = userId => {
    this.setState({ loading: true, canEdit: false, ownProfile: false });

    if (this.props.currentUser.isAdmin) {
      this.setState({ canEdit: true });
    }

    userId = parseInt(userId);

    this.props
      .fetchUser(userId)
      .then(() => {
        if (userId === this.props.currentUser.id || !userId) {
          userId = this.props.currentUser.id;
          this.setState({ canEdit: true, ownProfile: true });
        }

        const teamId = this.props.users.all[userId].teamId;

        this.setState({ userIdToDisplay: userId, teamIdToDisplay: teamId });

        const actions = [];

        if (this.state.ownProfile) {
          actions.push({ func: this.props.fetchAllUserScores, param: userId });
          actions.push({ func: this.props.fetchEvents, param: null });
          if (teamId) {
            actions.push({ func: this.props.fetchAllTeamScores, param: teamId });
            actions.push({ func: this.props.fetchTeam, param: teamId });
          }
        }

        return Promise.all(
          actions.map(action => {
            return action.func(action.param);
          })
        );
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  showLogActivityForm = eventId => {
    this.setState({ showLogActivityForm: true, logActivityEventId: eventId });
  };

  toggleLogActivityForm = () => {
    this.setState(prevState => ({
      showLogActivityForm: !prevState.showLogActivityForm,
    }));
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
                if (this.state.ownProfile)
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

  renderUserScores() {
    const events = this.props.events;
    const userScores = Object.values(this.props.scores.user[this.state.userIdToDisplay]).map(score => {
      const teamScore = this.props.scores.team[this.state.teamIdToDisplay][score.eventId];

      return (
        <Col xs="12" lg="6" key={score.eventId} className="mb-3">
          <UserScoreCard
            score={score}
            teamScore={teamScore}
            event={events[score.eventId]}
            cardWidth={Constants.USER_SCORE_CARD_WIDTH.NARROW}
            showLogActivityForm={this.showLogActivityForm}
          />
        </Col>
      );
    });

    return (
      <Row className="mb-5">
        {userScores.length > 0 ? (
          userScores
        ) : (
          <Col>
            <Alert color="warning">
              You have not participated in any events yet. Get started <Link to={Constants.PATHS.START}>here</Link>.
            </Alert>
          </Col>
        )}
      </Row>
    );
  }

  render() {
    const userToDisplay = this.props.users.all[this.state.userIdToDisplay];
    const teamToDisplay = this.props.teams[this.state.teamIdToDisplay];

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
            {this.state.canEdit && userToDisplay && !this.state.loading && (
              <Button color="primary" size="sm" onClick={this.showEditUserForm}>
                Edit Profile
              </Button>
            )}
          </Col>
        </Row>
        {this.state.loading ? <PageSpinner /> : this.renderUserInfo()}

        <Row className="mb-3">
          <Col xs="2">
            <h4>Team</h4>
          </Col>
          <Col>
            {this.state.ownProfile && teamToDisplay && !this.state.loading && (
              <Button color="danger" size="sm">
                Leave Team
              </Button>
            )}
          </Col>
        </Row>
        {this.state.loading ? <PageSpinner /> : this.renderUserTeam()}

        {this.state.ownProfile && (
          <React.Fragment>
            <Row className="mb-3">
              <Col>
                <h4>Activity</h4>
              </Col>
            </Row>
            {this.state.loading ? <PageSpinner /> : this.renderUserScores()}
          </React.Fragment>
        )}

        <EditUserForm
          initialValues={userToDisplay}
          isOpen={this.state.showEditUserForm}
          toggle={this.toggleEditUserForm}
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
    users: state.users,
    regions: state.regions,
    roles: state.roles,
    teams: state.teams,
    scores: state.scores,
    events: state.events,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchUser,
    fetchTeam,
    editUser,
    fetchAllUserScores,
    fetchAllTeamScores,
    fetchEvents,
  }
)(Profile);
