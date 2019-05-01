import React, { Component } from 'react';
import { Progress, Table, Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchUsers, fetchCurrentTeam, fetchCurrentUser, fetchTeam } from '../actions';
class TeamUserReadOnly extends Component {
  state = { loading: true };

  toggleSpinner = () => {
    this.setState(prevState => ({
      loading: !prevState.loading,
    }));
  };

  componentDidMount() {
    Promise.all([this.props.fetchTeam(this.props.paramId), this.props.fetchCurrentUser(), this.props.fetchUsers()])
      .then(() => {
        this.toggleSpinner();
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

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
            <td> </td>
          </tr>
        );
      });
    return users;
  }

  teamInfo() {
    console.log(this.props.team);
    return (
      <div>
        <h3>Team Name: {this.props.team.name}</h3>
        <h4>Description: {this.props.team.description}</h4>
        <h2 className="mt-2">Progress: </h2>
        <div id="progress">
          <Progress bar animated color="primary" value={(this.props.team.progressamt / this.props.team.goal) * 100}>
            Check out This Hot Progress
          </Progress>
        </div>
        <div>
          <h4>Members:</h4>
          <Table striped>
            <thead>
              <tr>
                <th>Names</th>
                <th>Scores</th>
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
  };
};

export default connect(
  mapStateToProps,
  { fetchUsers, fetchCurrentTeam, fetchCurrentUser, fetchTeam }
)(TeamUserReadOnly);
