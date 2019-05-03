import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Breadcrumb, BreadcrumbItem, Spinner, Row, Button, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchTeams, fetchUsers, fetchRegions, postJoinRequest, fetchCurrentUser, fetchJoinRequests } from '../actions';

class TeamsList extends Component {
  state = { loading: true, clickable: true };
  toggleSpinner = () => {
    this.setState(prevState => ({
      loading: !prevState.loading,
    }));
  };
  componentDidMount() {
    // this.toggleSpinner();
    Promise.all([
      this.props.fetchTeams(),
      this.props.fetchUsers(),
      this.props.fetchRegions(),
      this.props.fetchCurrentUser(),
    ])
      .then(() => {
        this.toggleSpinner();
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

  sendJoinRequest(team) {
    this.setState({ clickable: false });
    console.log(team);
    console.log('able to send request!');

    const reqObj = { teamId: team.id, userId: this.props.currentUser.id };
    this.props
      .postJoinRequest(reqObj)
      .then(() => {
        this.fetchJoinRequests();
      })
      .then(() => {
        this.setState({ clickable: true });
      })
      .catch(() => {
        this.setState({ clickable: true });
      });
  }

  checkClickable(team) {
    if (this.props.currentUser.teamId === null) {
      if (team.numMembers >= 5) {
        return <Button color="secondary">Team Is Full</Button>;
      } else if (this.state.clickable === true) {
        return (
          <Button color="primary" onClick={() => this.sendJoinRequest(team)}>
            Request to Join Team!
          </Button>
        );
      }
    }
  }

  teamTable() {
    var teams = this.props.teams.map(team => {
      return (
        <tr key={team.id}>
          <th scope="row" />
          <td>{team.name}</td>
          <td>
            {this.props.users[team.userId].fname} {this.props.users[team.userId].lname}
          </td>
          <td>{this.props.regions[this.props.users[team.userId].regionId].name}</td>
          <td>
            <Link to={`/team/${team.id}`}>
              <Button>View Team</Button>
            </Link>
          </td>
          <td>{team.numMembers}</td>
          <td>{this.checkClickable(team)}</td>
        </tr>
      );
    });
    return teams;
  }

  decideRender() {
    //console.log(this.state.isSpin);
    if (this.state.loading === true) {
      //console.log('spin');
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    } else {
      return (
        <div>
          <Table striped>
            <thead>
              <tr>
                <th scope="row" />
                <th>Team Name</th>
                <th>Team Leader</th>
                <th>Region</th>
                <th>Page</th>
                <th>Members</th>
                <th>Request</th>
              </tr>
            </thead>
            <tbody>{this.teamTable()}</tbody>
          </Table>
          <br />
        </div>
      );
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
        <Row>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>TeamList</BreadcrumbItem>
          </Breadcrumb>
        </Row>
        <h3>List of Teams: </h3>
        <div>{this.decideRender()}</div>
      </Container>
    );
  }
}
const mapStateToProps = state => {
  return {
    teams: Object.values(state.team),
    users: Object.values(state.users),
    regions: state.regions,
    currentUser: state.currentUser,
    allJoinRequests: state.allJoinRequests,
  };
};

export default connect(
  mapStateToProps,
  { fetchTeams, fetchUsers, fetchRegions, postJoinRequest, fetchCurrentUser, fetchJoinRequests }
)(TeamsList);
