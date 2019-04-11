import React, { Component } from 'react';
import { Container, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchUsers } from '../actions';

class TeamReadOnly extends Component {
  showTeamMembers() {
    const users = this.props.users.map(teamate => {
      //console.log(teamate);
      if (teamate.teamid === this.props.team.id) return <div key={teamate.id}>{teamate.name}</div>;
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
