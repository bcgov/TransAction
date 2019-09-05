import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Row, Col, Input, Table, Button } from 'reactstrap';
import _ from 'lodash';

import { fetchTeams, fetchCurrentTeam, fetchUsers, editUser, createJoinRequest, fetchJoinRequests } from '../actions';

import PageSpinner from './ui/PageSpinner';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import DialogModal from './ui/DialogModal';
import ScrollLoader from './fragments/ScollLoader';

import * as api from '../api/api';
import * as Constants from '../Constants';

class TeamsList extends Component {
  state = {
    loading: true,
    showConfirmDialog: false,
    confirmDialogOptions: {},
    searchTerm: undefined,
    page: 0,
    pageSize: 15,
    pageCount: 1,
    teamSearchTerm: '',
  };

  componentDidMount() {
    api.resetCancelTokenSource();
    const { currentUser, teams, fetchCurrentTeam, fetchJoinRequests } = this.props;
    if (currentUser.teamId && !teams[currentUser.teamId]) {
      fetchCurrentTeam();
    }

    fetchJoinRequests();
    this.loadData();
  }

  componentWillUnmount() {
    api.cancelRequest();
  }

  loadData = () => {
    const nextPage = this.state.page + 1;
    if (this.state.page < this.state.pageCount) {
      this.props.fetchTeams(this.state.searchTerm, nextPage, this.state.pageSize).then(pageCount => {
        this.setState({ loading: false, page: nextPage, pageCount });
      });
    }
  };

  sendJoinRequest = (confirm, userId, teamId) => {
    if (confirm) {
      this.props.createJoinRequest({ userId, teamId }).finally(() => this.closeConfirmDialog());
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

  becomeFreeagent = confirm => {
    if (confirm) {
      const { currentUser, editUser } = this.props;
      const userObj = { ...currentUser, isFreeAgent: true };

      editUser(userObj.id, userObj).finally(() => this.closeConfirmDialog());
    } else {
      this.closeConfirmDialog();
    }
  };

  confirmBecomeFreeagent = () => {
    this.setState({
      showConfirmDialog: true,
      confirmDialogOptions: {
        title: 'Become a Free Agent?',
        body:
          'Becoming a free agent will allow any team with extra room on its roster to recruit you as its new member.',
        secondary: true,
        callback: confirm => this.becomeFreeagent(confirm),
      },
    });
  };

  closeConfirmDialog() {
    this.setState({ showConfirmDialog: false, confirmDialogOptions: {} });
  }

  renderTeamRows() {
    const { currentUser, regions } = this.props;
    const userRequests = this.props.joinRequests
      .filter(request => {
        return request.userId === currentUser.id;
      })
      .map(request => {
        return request.teamId;
      });

    const teamSearchTerm = this.state.teamSearchTerm.trim().toUpperCase();
    let filteredTeams = Object.values(this.props.teams);

    if (this.state.teamSearchTerm.trim() !== '')
      filteredTeams = _.filter(filteredTeams, t => {
        return t.name.toUpperCase().includes(teamSearchTerm);
      });

    var teams = _.orderBy(filteredTeams, user => {
      return user.name.toLowerCase();
    }).map(team => {
      return (
        <tr key={team.id}>
          <td>
            <Link className="text-decoration-none" to={`${Constants.PATHS.TEAM}/${team.id}`}>
              {team.name}
            </Link>
          </td>
          <td>{team.teamLeaderName}</td>
          <td>{regions[team.regionId].name}</td>
          <td>{team.numMembers}</td>
          {!currentUser.teamId && (
            <td className="fit">
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

  handleTeamSearchTermChanged = e => {
    this.setState({ teamSearchTerm: e.target.value });

    const value = e.target.value.trim();
    if (value !== '') this.props.fetchTeams(e.target.value.trim());
  };

  renderTeamList() {
    const teamRows = this.renderTeamRows();

    return (
      <React.Fragment>
        <h4 className="mb-3">All TransAction Teams</h4>

        {!this.props.currentUser.teamId && !this.props.currentUser.isFreeAgent && (
          <div className="mb-3 text-right">
            <Button size="sm" color="primary" onClick={this.confirmBecomeFreeagent}>
              Become Free Agent
            </Button>
          </div>
        )}

        <Row className="mb-3">
          <Col sm={0} md={6} />
          <Col sm={12} md={6}>
            <Input
              type="text"
              id="teamSearchTerm"
              placeholder="Search by team name"
              bsSize="sm"
              value={this.state.teamSearchTerm}
              onChange={this.handleTeamSearchTermChanged}
            />
          </Col>
        </Row>

        {teamRows.length > 0 ? (
          <ScrollLoader
            loader={this.loadData}
            page={this.state.page}
            pageCount={this.state.pageCount}
            shouldLoad={this.state.teamSearchTerm.trim() === ''}
          >
            <Table size="sm" hover bordered responsive>
              <thead className="thead-dark">
                <tr>
                  <th>Team Name</th>
                  <th>Team Leader</th>
                  <th>Region</th>
                  <th>Members</th>
                  {!this.props.currentUser.teamId && <th className="fit" />}
                </tr>
              </thead>
              <tbody>{teamRows}</tbody>
            </Table>
          </ScrollLoader>
        ) : (
          <Alert color="primary">There are no teams at the moment.</Alert>
        )}

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
        <div>
          {teams[currentUser.teamId] && (
            <Link
              to={`${Constants.PATHS.TEAM}/${currentUser.teamId}`}
              className="text-decoration-none"
              style={{ fontSize: '2rem', fontWeight: '900' }}
            >
              {teams[currentUser.teamId].name} <Button color="primary">View</Button>
            </Link>
          )}
        </div>
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
        <h4>Personal Team</h4>
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
    currentUser: state.users.all[state.users.current.id],
    joinRequests: Object.values(state.joinRequests),
  };
};

export default connect(
  mapStateToProps,
  { fetchTeams, fetchCurrentTeam, fetchUsers, editUser, createJoinRequest, fetchJoinRequests }
)(TeamsList);
