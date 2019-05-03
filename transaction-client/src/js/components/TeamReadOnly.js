import React, { Component } from 'react';
import { Table, Spinner, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchUsers, fetchCurrentTeam, fetchCurrentUser, fetchTeam, fetchRoles } from '../actions';
import { Link } from 'react-router-dom';

class TeamReadOnly extends Component {
  state = { loading: true };

  toggleSpinner = () => {
    this.setState(prevState => ({
      loading: !prevState.loading,
    }));
  };

  componentDidMount() {
    Promise.all([
      this.props.fetchTeam(this.props.paramId),
      this.props.fetchCurrentUser(),
      this.props.fetchUsers(),
      this.props.fetchRoles(),
    ])
      .then(() => {
        this.toggleSpinner();
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

  checkLeader(user) {
    if (this.props.roles[user.roleId].name !== 'user') {
      return this.props.roles[user.roleId].name;
    }
  }

  //TODO SHOW POINTS
  showTeamMembers() {
    var users = this.props.users
      .filter(user => {
        return user.teamId === this.props.team.id;
      })
      .map(teamate => {
        return (
          <tr key={teamate.id}>
            <td>
              {teamate.fname} {teamate.lname}
            </td>
            <td>{this.checkLeader(teamate)}</td>
            <td> </td>
            <td>
              <Link to={`/profile/${teamate.id}`}>
                <Button color="primary">View Profile</Button>
              </Link>
            </td>
          </tr>
        );
      });
    return users;
  }

  teamInfo() {
    return (
      <div>
        <h3>Team Name: {this.props.team.name}</h3>
        <h4>Description: {this.props.team.description}</h4>
        <div>
          <h4>Members:</h4>
          <Table striped>
            <thead>
              <tr>
                <th>Names</th>
                <th>Lead</th>
                <th>Scores</th>
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>{this.showTeamMembers()}</tbody>
          </Table>
        </div>
      </div>
    );
  }

  loading() {
    if (this.state.loading) {
      //console.log('spin');
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    } else {
      return this.teamInfo();
    }
  }

  render() {
    return this.loading();
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: Object.values(state.users),
    currentTeam: state.currentTeam,
    currentUser: state.currentUser,
    team: state.team[ownProps.paramId],
    roles: state.roles,
  };
};

export default connect(
  mapStateToProps,
  { fetchUsers, fetchCurrentTeam, fetchCurrentUser, fetchTeam, fetchRoles }
)(TeamReadOnly);
