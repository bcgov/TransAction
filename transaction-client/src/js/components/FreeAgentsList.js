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
  fetchRole,
} from '../actions';

class FreeAgentsList extends Component {
  state = { loading: true, clickable: true };

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
        Promise.all([
          this.props.fetchCurrentTeam(this.props.currentUser.teamId),
          this.props.fetchRole(this.props.currentUser.roleId),
        ]);
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
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    } else return this.checkRole();
  }

  recruitAgent(user) {
    this.setState({ clickable: false });

    if (this.props.currentTeam.numMembers >= 5) {
      this.setState({ clickable: true });
    } else {
      const teamId = { teamId: this.props.currentUser.teamId, isFreeAgent: false };
      const recUser = { ...user, ...teamId };
      this.props.editUser(recUser, user.id).then(() => {
        this.props
          .fetchCurrentTeam(this.props.currentUser.teamId)
          .then(() => {
            this.setState({ clickable: true });
          })
          .catch(() => {
            this.setState({ clickable: true });
          });
      });
    }
  }

  checkClickable(user) {
    if (this.state.clickable === true && this.props.currentTeam.numMembers < 5) {
      return (
        <Button color="primary" onClick={() => this.recruitAgent(user)}>
          Recruit!
        </Button>
      );
    } else {
      return <div>Your Team is Full!</div>;
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
              <Link to={`/profile/${user.id}`}>
                <Button>View Profile</Button>
              </Link>
            </td>
            <td>{this.checkClickable(user)}</td>
          </tr>
        );
      });
    return agents;
  }

  checkRole() {
    if (this.props.currentRole.name === 'user') {
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
                <th>Profile</th>
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
    currentRole: state.currentRole,
  };
};
export default connect(
  mapStateToProps,
  { fetchUsers, fetchCurrentUser, fetchRoles, fetchRegions, fetchTeam, editUser, fetchCurrentTeam, fetchRole }
)(FreeAgentsList);
