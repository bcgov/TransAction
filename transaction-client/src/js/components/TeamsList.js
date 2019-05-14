import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, BreadcrumbItem, Row, Col, Button, Table } from 'reactstrap';

import { fetchTeams, fetchUsers, createJoinRequest, fetchJoinRequests, showGlobalModal } from '../actions';

import PageSpinner from './ui/PageSpinner';

import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as Constants from '../Constants';

class TeamsList extends Component {
  state = { loading: true };

  componentDidMount() {
    this.setState({ loading: true });
    Promise.all([this.props.fetchTeams(), this.props.fetchUsers()])
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {});
  }

  sendJoinRequest = () => {};

  confirmSendRequest = team => {
    const body = `Send join team request to ${team.name}?`;
    const title = 'Request to Join';
    this.props.showGlobalModal({ body, title });
  };

  renderTeamRows() {
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
            {this.props.users[team.teamLeaderId].fname} {this.props.users[team.teamLeaderId].lname}
          </td>
          <td>{this.props.regions[this.props.users[team.teamLeaderId].regionId].name}</td>
          <td>{team.numMembers}</td>
          <td>
            <Button size="sm" color="primary" onClick={() => this.confirmSendRequest(team)}>
              Request to Join
            </Button>
          </td>
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
            <th>Request</th>
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
      <Container>
        <BreadcrumbFragment>
          <BreadcrumbItem active>Teams</BreadcrumbItem>
        </BreadcrumbFragment>
        {this.state.loading ? <PageSpinner /> : this.renderContent()}
      </Container>
    );
  }
}
const mapStateToProps = state => {
  return {
    teams: Object.values(state.teams),
    users: state.users.all,
    regions: state.regions,
    currentUser: state.users.current,
    joinRequests: state.joinRequests,
  };
};

export default connect(
  mapStateToProps,
  { fetchTeams, fetchUsers, createJoinRequest, fetchJoinRequests, showGlobalModal }
)(TeamsList);
