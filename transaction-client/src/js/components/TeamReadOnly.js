import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchUsers } from '../actions';

class TeamReadOnly extends Component {
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
        <div>
          <h4>Members:</h4>
          <div className="offset-1">{this.showTeamMembers()}</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Container>
        <div>we are in read only mode! and this aint your team</div>
        {this.teamInfo()}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  // console.log(ownProps);
  return {
    users: Object.values(state.users),
  };
};

export default connect(
  mapStateToProps,
  { fetchUsers }
)(TeamReadOnly);
