import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchTeams } from '../actions';

class TeamsList extends Component {
  componentDidMount() {
    this.props.fetchTeams();
  }

  showTeams() {
    const teams = this.props.teams.map(team => {
      //console.log(teamate);
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
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>TeamList</BreadcrumbItem>
        </Breadcrumb>
        <h3>List of Teams: </h3>
        <div>{this.showTeams()}</div>
      </Container>
    );
  }
}
const mapStateToProps = state => {
  return { teams: Object.values(state.team) };
};

export default connect(
  mapStateToProps,
  { fetchTeams }
)(TeamsList);
