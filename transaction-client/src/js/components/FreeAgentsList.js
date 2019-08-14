import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Table } from 'reactstrap';

import { fetchUsers, fetchTeam, addUserToTeam, fetchUser } from '../actions';
import PageSpinner from './ui/PageSpinner';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import DialogModal from './ui/DialogModal';

import * as api from '../api/api';
import * as utils from '../utils';

class FreeAgentsList extends Component {
  state = { loading: true, showConfirmDialog: false, confirmDialogOptions: {} };

  toggleSpinner = () => {
    this.setState(prevState => ({
      loading: !prevState.loading,
    }));
  };

  componentDidMount() {
    api.resetCancelTokenSource();
    const { fetchUsers, fetchTeam, teams, currentUser } = this.props;

    fetchUsers()
      .then(() => {
        if (currentUser.teamId && !teams[currentUser.teamId]) return fetchTeam(currentUser.teamId);
        else return Promise.resolve();
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  componentWillUnmount() {
    api.cancelRequest();
  }

  handleRecruitUser = (confirm, userId) => {
    if (confirm) {
      const { teams, currentUser, addUserToTeam, fetchUser } = this.props;
      const team = teams[currentUser.teamId];

      addUserToTeam({ userId, teamId: team.id })
        .then(() => Promise.all([fetchUser(userId), fetchTeam[team.id]]))
        .then(() => this.closeConfirmDialog());
    } else {
      this.closeConfirmDialog();
    }
  };

  confirmRecruitUser = (userId, userName) => {
    this.setState({
      showConfirmDialog: true,
      confirmDialogOptions: {
        title: 'Recruit Member?',
        body: `${userName} will be joining your team.`,
        secondary: true,
        callback: confirm => this.handleRecruitUser(confirm, userId),
      },
    });
  };

  closeConfirmDialog() {
    this.setState({ showConfirmDialog: false, confirmDialogOptions: {} });
  }

  renderContent() {
    const { regions, users } = this.props;
    const freeagentUsers = Object.values(users).filter(user => user.isFreeAgent && !user.teamId);

    if (freeagentUsers.length === 0) return <Alert color="primary">There are no free agents at the moment.</Alert>;

    const userRows = freeagentUsers.map(user => (
      <tr key={user.id}>
        <td>{user.fname}</td>
        <td>{user.lname}</td>
        <td>{regions[user.regionId].name}</td>

        {utils.isCurrentUserTeamlead() && (
          <td>
            <Button
              color="primary"
              size="sm"
              onClick={() => this.confirmRecruitUser(user.id, `${user.fname} ${user.lname}`)}
            >
              Recruit
            </Button>
          </td>
        )}
      </tr>
    ));

    return (
      <Table size="sm" hover bordered responsive className="mt-3">
        <thead className="thead-dark">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Region</th>
            {utils.isCurrentUserTeamlead() && <th />}
          </tr>
        </thead>
        <tbody>{userRows}</tbody>
      </Table>
    );
  }

  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment>{[{ active: true, text: 'Free Agents' }]}</BreadcrumbFragment>
        <CardWrapper>
          <h4>Free Agents</h4>
          <p>
            Team leaders can recruit from TransAction <em>Free Agents</em> below.
          </p>
          {this.state.loading ? <PageSpinner /> : this.renderContent()}
        </CardWrapper>
        {this.state.showConfirmDialog && (
          <DialogModal isOpen={this.state.showConfirmDialog} options={this.state.confirmDialogOptions} />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.users.all,
    teams: state.teams,
    currentUser: state.users.all[state.users.current.id],
    regions: state.regions,
  };
};
export default connect(
  mapStateToProps,
  { fetchUsers, fetchTeam, addUserToTeam, fetchUser }
)(FreeAgentsList);
