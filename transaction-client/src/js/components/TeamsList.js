import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BreadcrumbItem, Row, Col, Button, Table } from 'reactstrap';

import { fetchTeams, fetchUsers, createJoinRequest, fetchJoinRequests } from '../actions';

import PageSpinner from './ui/PageSpinner';

import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as Constants from '../Constants';

class TeamsList extends Component {
  state = { loading: true };

  componentDidMount() {
    this.setState({ loading: true });
    Promise.all([this.props.fetchTeams(), this.props.fetchUsers(), this.props.fetchJoinRequests()])
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {});
  }

  sendJoinRequest = (userId, teamId) => {
    this.props.createJoinRequest({ userId, teamId });
  };

  renderTeamRows() {
    const { currentUser, users, regions } = this.props;
    const userRequests = this.props.joinRequests
      .filter(request => {
        return request.userId === currentUser.id;
      })
      .map(request => {
        return request.teamId;
      });

    var teams = this.props.teams.map(team => {
      return (
        <tr key={team.id}>
          <th scope="row" />
          <td>
            <Link className="no-underline" to={`${Constants.PATHS.TEAM}/${team.id}`}>
              {team.name}
            </Link>
          </td>
          <td>
            {users[team.teamLeaderId].fname} {users[team.teamLeaderId].lname}
          </td>
          <td>{regions[users[team.teamLeaderId].regionId].name}</td>
          <td>{team.numMembers}</td>
          {!currentUser.teamId && (
            <td>
              {!userRequests.includes(team.id) && (
                <Button size="sm" color="primary" onClick={() => this.sendJoinRequest(currentUser.id, team.id)}>
                  Request to Join
                </Button>
              )}
            </td>
          )}
        </tr>
      );
    });
    return teams;
  }

  renderTeamList() {
    return (
      <Table striped size="sm">
        <thead>
          <tr>
            <th scope="row" />
            <th>Team Name</th>
            <th>Team Leader</th>
            <th>Region</th>
            <th>Members</th>
            {!this.props.currentUser.teamId && <th>Request</th>}
          </tr>
        </thead>
        <tbody>{this.renderTeamRows()}</tbody>
      </Table>
    );
  }

  renderContent() {
    return (
      <Row>
        <Col>{this.renderTeamList()}</Col>
      </Row>
    );
  }

  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment>
          <BreadcrumbItem active>Teams</BreadcrumbItem>
        </BreadcrumbFragment>
        {this.state.loading ? <PageSpinner /> : this.renderContent()}
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    teams: Object.values(state.teams),
    users: state.users.all,
    regions: state.regions,
    currentUser: state.users.current,
    joinRequests: Object.values(state.joinRequests),
  };
};

export default connect(
  mapStateToProps,
  { fetchTeams, fetchUsers, createJoinRequest, fetchJoinRequests }
)(TeamsList);
