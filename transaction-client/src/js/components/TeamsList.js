import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Breadcrumb, BreadcrumbItem, Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchTeams } from '../actions';

class TeamsList extends Component {
  state = { loading: true };
  toggleSpinner = () => {
    this.setState(prevState => ({
      loading: !prevState.loading,
    }));
  };
  componentDidMount() {
    // this.toggleSpinner();
    Promise.all([this.props.fetchTeams()])
      .then(() => {
        this.toggleSpinner();
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

  decideRender() {
    //console.log(this.state.isSpin);
    if (this.state.isSpin === true) {
      //console.log('spin');
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    } else {
      return this.showTeams();
    }
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
        <div>{this.decideRender()}</div>
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
