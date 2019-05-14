import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, BreadcrumbItem, Row, Col, Button, Table } from 'reactstrap';

import { fetchTeams, fetchUsers, createJoinRequest, fetchJoinRequests } from '../actions';
import PageSpinner from './ui/PageSpinner';
import BreadcrumbFragment from './ui/BreadcrumbFragment';

import * as Constants from '../Constants';

class TeamsList extends Component {
  state = { loading: true, clickable: true };

  componentDidMount() {
    this.setState({ loading: true });
    Promise.all([this.props.fetchTeams(), this.props.fetchUsers()])
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {});
  }

  sendJoinRequest(team) {
    this.setState({ clickable: false });

    const reqObj = { teamId: team.id, userId: this.props.currentUser.id };
    this.props
      .postJoinRequest(reqObj)
      .then(() => {
        this.fetchJoinRequests();
      })
      .then(() => {
        this.setState({ clickable: true });
      })
      .catch(() => {
        this.setState({ clickable: true });
      });
  }

  checkClickable(team) {
    if (this.props.currentUser.teamId === null) {
      if (team.numMembers >= 5) {
        return <Button color="secondary">Team Is Full</Button>;
      } else if (this.state.clickable === true) {
        return (
          <Button color="primary" onClick={() => this.sendJoinRequest(team)}>
            Request to Join Team!
          </Button>
        );
      }
    }
  }

  teamTable() {
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
          <td>{this.checkClickable(team)}</td>
        </tr>
      );
    });
    return teams;
  }

  decideRender() {
    if (this.state.loading === true) {
      return <PageSpinner />;
    } else {
      return (
        <div>
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
            <tbody>{this.teamTable()}</tbody>
          </Table>
          <br />
        </div>
      );
    }
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
        <tbody>{this.teamTable()}</tbody>
      </Table>
    );
  }

  renderContent() {
    return (
      <Row>
        <Col>this.renderTeamList()</Col>
      </Row>
    );
  }

  showTeams() {
    const teams = this.props.teams.map(team => {
      return (
        <div key={team.id}>
          <Link to={`/team/${team.id}`}>{team.name}</Link>
        </div>
      );
    });
    return teams;
  }

  render() {
    return (
      <Container>
        <BreadcrumbFragment>
          <BreadcrumbItem active>Teams</BreadcrumbItem>
        </BreadcrumbFragment>
        <div>{this.decideRender()}</div>
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
  { fetchTeams, fetchUsers, createJoinRequest, fetchJoinRequests }
)(TeamsList);
