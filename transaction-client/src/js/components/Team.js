import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Row, Col, Table, Modal, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';

import {
  fetchCurrentUser,
  fetchTeam,
  editTeam,
  fetchUsers,
  editUser,
  fetchSpecificTeamRequests,
  editJoinRequest,
} from '../actions';
import PageSpinner from './ui/PageSpinner';
import ProfileFragment from './ui/ProfileFragment';
import TeamMemberRow from './ui/TeamMemberRow';

import * as Constants from '../Constants';

class Team extends Component {
  state = {
    loading: true,
    canEdit: false,
    ownTeamProfile: false,
    teamIdToDisplay: null,
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

    Promise.all([this.props.fetchTeam(teamId), this.props.fetchUsers(), this.props.fetchSpecificTeamRequests(teamId)])
      .then(() => {
        const team = this.props.teams[teamId];

        // If team lead
        if (!team && team.userId === currentUser.id) this.setState({ canEdit: true });

        if (currentUser.teamId === teamId) this.setState({ ownTeamProfile: true });

        this.setState({ teamIdToDisplay: teamId, loading: false });
      })
      .catch(() => {});
  };

  renderTeamInfo(teamToDisplay) {
    return (
      <React.Fragment>
        <ProfileFragment
          {..._.pick(teamToDisplay, 'name', 'description')}
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
                currentUser.id === teamToDisplay.userId && (
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

  renderTeamScores() {}

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
              <Button color="primary" size="sm">
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

        {teamToDisplay && this.props.currentUser.id === teamToDisplay.userId && (
          <React.Fragment>
            <Row className="mb-3">
              <Col>
                <h4>Team Join Requests</h4>
              </Col>
            </Row>
            {this.state.loading ? <PageSpinner /> : this.renderTeamJoinRequests(teamToDisplay)}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.current,
    allTeamScores: state.allTeamScores,
    teams: state.teams,
    users: Object.values(state.users.all),
    roles: state.roles,
    joinRequests: Object.values(state.joinRequests),
    regions: state.regions,
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
  }
)(Team);
