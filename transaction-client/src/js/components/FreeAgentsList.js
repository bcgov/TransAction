import React, { Component } from 'react';
import { Row, Container, Breadcrumb, BreadcrumbItem, Spinner, Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  fetchUsers,
  fetchCurrentUser,
  fetchRoles,
  fetchRegions,
  fetchTeam,
  editUser,
  fetchCurrentTeam,
} from '../actions';

class FreeAgentsList extends Component {
  state = { userRole: '', loading: true };

  toggleSpinner = () => {
    this.setState(prevState => ({
      loading: !prevState.loading,
    }));
  };

  componentDidMount() {
    Promise.all([
      this.props.fetchCurrentUser(),
      this.props.fetchRoles(),
      this.props.fetchUsers(),
      this.props.fetchRegions(),
    ])
      .then(() => {
        this.setState({ userRole: this.props.roles[this.props.currentUser.roleId].name });
        Promise.all([this.props.fetchCurrentTeam(this.props.currentUser.teamId)]);
      })
      .then(() => {
        this.toggleSpinner();
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

  loading() {
    if (this.state.loading) {
      // console.log('spin');
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    } else return this.checkRole();
  }

  recruitAgent(user) {
    console.log(user);
    console.log(this.props.currentTeam);
    if (this.props.currentTeam.num_members >= 5) {
      console.log('full team!');
    } else {
      console.log('able to recruit!');
      const teamId = { teamId: this.props.currentUser.teamId, isFreeAgent: false };
      const recUser = { ...user, ...teamId };
      this.props.editUser(recUser, user.id);
    }
  }

  renderAgents() {
    var agents = this.props.users
      .filter(user => {
        return user.isFreeAgent === true;
      })
      .map(user => {
        return (
          <tr key={user.id}>
            <th scope="row" />
            <td>{user.fname}</td>
            <td>{user.lname}</td>
            <td>{this.props.regions[user.regionId].name}</td>
            <td>
              <Button color="primary" onClick={() => this.recruitAgent(user)}>
                Recruit!
              </Button>
            </td>
          </tr>
        );
      });
    return agents;
  }

  checkRole() {
    if (this.state.userRole !== 'team_lead') {
      return <h2>Access to Free Agents Denied: You are not a Team Leader!</h2>;
    } else {
      return (
        <div className="offset-1">
          <Table striped>
            <thead>
              <tr>
                <th scope="row" />
                <th>First Name</th>
                <th>Last Name</th>
                <th>Region</th>
                <th>Recruit</th>
              </tr>
            </thead>
            <tbody>{this.renderAgents()}</tbody>
          </Table>
          <br />
        </div>
      );
    }
  }

  render() {
    return (
      <Container>
        <Row>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/teamslist">Teams List</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/team">Team</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Free Agents List</BreadcrumbItem>
          </Breadcrumb>
        </Row>
        <h1>Free Agents</h1>
        {this.loading()}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: Object.values(state.users),
    regions: state.regions,
    currentUser: state.currentUser,
    roles: state.roles,
    team: state.team,
    currentTeam: state.currentTeam,
  };
};
export default connect(
  mapStateToProps,
  { fetchUsers, fetchCurrentUser, fetchRoles, fetchRegions, fetchTeam, editUser, fetchCurrentTeam }
)(FreeAgentsList);
