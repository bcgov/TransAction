import React, { Component } from 'react';
import { Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchUsers } from '../actions';
class TeamUserReadOnly extends Component {
  checkUser(user) {
    if (user.teamid === this) return user;
  }

  showTeamMembers() {
    var users = this.props.users.filter(this.checkUser, this.props.team.id).map(teamate => {
      //console.log(teamate);
      return <div key={teamate.id}>{teamate.name}</div>;
    });
    return users;
  }

  teamInfo() {
    return (
      <div>
        <h3>Team Name: {this.props.team.name}</h3>
        <h4>Description: {this.props.team.description}</h4>
        <h2 className="mt-2">Progress: </h2>
        <div className="progress">
          <Progress bar animated color="primary" value={(this.props.team.progressamt / this.props.team.goal) * 100}>
            Check out This Hot Progress
          </Progress>
        </div>
        <div>
          <h4>Members:</h4>
          <div className="offset-1">{this.showTeamMembers()}</div>
        </div>
      </div>
    );
  }

  render() {
    return <React.Fragment>{this.teamInfo()}</React.Fragment>;
  }
}

const mapStateToProps = state => {
  return {
    users: Object.values(state.users),
  };
};

export default connect(
  mapStateToProps,
  { fetchUsers }
)(TeamUserReadOnly);
