import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Button } from 'reactstrap';

import { fetchTeams, fetchUsers, createJoinRequest, fetchJoinRequests } from '../actions';

import PageSpinner from './ui/PageSpinner';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import DialogModal from './ui/DialogModal';

import * as Constants from '../Constants';

class TeamsList extends Component {
  state = { loading: true, showConfirmDialog: false, confirmDialogOptions: {} };

  componentDidMount() {
    this.setState({ loading: true });
    Promise.all([this.props.fetchTeams(), this.props.fetchUsers(), this.props.fetchJoinRequests()])
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {});
  }

  sendJoinRequest = (confirm, userId, teamId) => {
    if (confirm) {
      this.props.createJoinRequest({ userId, teamId }).then(() => {
        this.closeConfirmDialog();
      });
    } else {
      this.closeConfirmDialog();
    }
  };

  confirmJoin = (userId, teamId) => {
    this.setState({
      showConfirmDialog: true,
      confirmDialogOptions: {
        title: 'Send Join Request?',
        body: 'This team leader will receive your join request.',
        secondary: true,
        callback: confirm => this.sendJoinRequest(confirm, userId, teamId),
      },
    });
  };

  closeConfirmDialog() {
    this.setState({ showConfirmDialog: false, confirmDialogOptions: {} });
  }

  renderTeamRows() {
    const { currentUser, users, regions } = this.props;
    const userRequests = this.props.joinRequests
      .filter(request => {
        return request.userId === currentUser.id;
      })
      .map(request => {
        return request.teamId;
      });

    var teams = Object.values(this.props.teams).map(team => {
      return (
        <tr key={team.id}>
          <td>
            <Link className="text-decoration-none" to={`${Constants.PATHS.TEAM}/${team.id}`}>
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
                <Button size="sm" color="primary" onClick={() => this.confirmJoin(currentUser.id, team.id)}>
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
      <React.Fragment>
        <h4>All TransAction Teams</h4>
        <Table size="sm" hover bordered responsive className="mt-3">
          <thead className="thead-dark">
            <tr>
              <th>Team Name</th>
              <th>Team Leader</th>
              <th>Region</th>
              <th>Members</th>
              {!this.props.currentUser.teamId && <th>Request</th>}
            </tr>
          </thead>
          <tbody>{this.renderTeamRows()}</tbody>
        </Table>
        {this.state.showConfirmDialog && (
          <DialogModal isOpen={this.state.showConfirmDialog} options={this.state.confirmDialogOptions} />
        )}
      </React.Fragment>
    );
  }

  renderTeamProfile() {
    const { currentUser, teams } = this.props;

    let output = null;

    if (currentUser.teamId) {
      output = (
        <p>
          You are on team <strong>{teams[currentUser.teamId].name}</strong>!{' '}
          <Link to={`${Constants.PATHS.TEAM}/${currentUser.teamId}`}>View Details</Link>.
        </p>
      );
    } else {
      output = (
        <p>
          You are not on a team. <Link to={Constants.PATHS.START}>Get started</Link> or join one of the teams below!
        </p>
      );
    }

    return (
      <React.Fragment>
        <h4>Personal Team Status</h4>
        {output}
      </React.Fragment>
    );
  }

  renderContent() {
    return (
      <React.Fragment>
        <CardWrapper>
          <Row>
            <Col>{this.renderTeamProfile()}</Col>
          </Row>
        </CardWrapper>
        <CardWrapper>
          <Row>
            <Col>{this.renderTeamList()}</Col>
          </Row>
        </CardWrapper>
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment>{[{ active: true, text: 'Teams' }]}</BreadcrumbFragment>
        {this.state.loading ? <PageSpinner /> : this.renderContent()}
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    teams: state.teams,
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
