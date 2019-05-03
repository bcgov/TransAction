import React, { Component } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Container,
  Spinner,
  Button,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  fetchCurrentUser,
  fetchTeam,
  editTeam,
  fetchUsers,
  fetchRoles,
  fetchCurrentTeam,
  editUser,
  fetchCurrentRole,
  fetchAllTeamScores,
  fetchAllTeamRequests,
} from '../actions';
import DescriptionForm from './DescriptionForm';
import TitleForm from './TitleForm';
import ProgressBar from './ProgressBar';
import ProgressModalBody from './ProgressModalBody';
import EventModal from './EventModal';
import TeamReadOnly from './TeamReadOnly';
import TeamUserReadOnly from './TeamUserReadOnly';
import NoTeamPage from './NoTeamPage';
import TeamAdminView from './TeamAdminView';

class Team extends Component {
  state = { loading: true, modal: false, clickable: true, modalLeave: false };
  toggleSpinner = () => {
    this.setState(prevState => ({
      loading: !prevState.loading,
    }));
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };
  toggleLeave = () => {
    this.setState(prevState => ({
      modalLeave: !prevState.modalLeave,
    }));
  };

  //TODO could be taken out into its own component?
  decideRender() {
    if (this.state.loading) {
      //console.log('spin');
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    }
    //Loading DONE
    else {
      console.log('THe current user is of role: ', this.props.currentRole.name);
      //paramId is passed
      if (this.props.paramId !== null) {
        //if the team id does not exist
        if (!this.props.team) {
          console.log(this.props.team);
          console.log('param id passed, team id doesnt exist');
          return <div>hmmmmmm.. we couldnt find that team :(</div>;
        }
        //if the paramId is the same as user teamid
        if (this.props.paramId === this.props.currentUser.teamId) {
          console.log('param id passed, team id is the same, its our team!');
          //If they are a team lead or admin
          if (this.props.currentRole.name !== 'user') {
            console.log('we are not a user, therefor we can edit!');
            return this.teamInfo();
          }
          //a regular user, therefor seeing his team in read only
          else {
            console.log('we are a user, so we cannot edit!');
            return <TeamUserReadOnly paramId={this.props.paramId} />;
          }
        }
        //paramid is NOT the same as user teamid; viewing someones team from the outside
        else {
          console.log('param id passed, team id is not the same, looking at someone elses team!');
          //If they are an admin
          if (this.props.currentRole.name === 'Admin') {
            console.log("param id passed, team id is not the same but we're an admin, so we can edit!");
            return <TeamAdminView paramId={this.props.paramId} />;
          } else {
            console.log('we are just a user, so we cannot edit');
            return <TeamReadOnly paramId={this.props.paramId} />;
          }
        }
      } else {
        console.log('NO param id');
        //no paramId passed
        //we have no teamid and no id was passed as param; load choices
        if (!this.props.currentUser.teamId) {
          console.log('BOI WE AINT GOT NO TEAM');
          return <NoTeamPage />;
        }
        //Following the user's teamid
        else {
          console.log('No param id but we do have a team, so we are looking at our own team!');
          //If they are a team lead or admin. Really wish the values for each role were sorted in order to prevent multiple checks
          if (this.props.currentRole.name !== 'user') {
            console.log('No param id, our team , we are not a user so we can edit!');
            return this.teamInfo();
          }
          //a regular user, therefor seeing his team in read only
          else {
            console.log("no param id, just a user so we're seeing our own team in read only");
            return <TeamUserReadOnly paramId={this.props.currentUser.teamId} />;
          }
        }
      }
    }
  }

  onSubmit = formValues => {
    //console.log('passed in ', formValues);
    const userObj = { ...this.props.currentTeam, ...formValues };
    //console.log('now contain ', userObj);
    this.props.editTeam(userObj, this.props.currentTeam.id);
  };

  componentDidMount() {
    // this.toggleSpinner();

    Promise.all([this.props.fetchCurrentUser(), this.props.fetchRoles()]).then(() => {
      console.log('param id: ', this.props.paramId);
      console.log('currentUser teamId: ', this.props.currentUser.teamId);
      this.props.fetchCurrentRole(this.props.currentUser.roleId);
      Promise.all([
        this.props.fetchTeam(this.props.paramId),
        this.props.fetchUsers(),
        this.props.fetchCurrentTeam(this.props.currentUser.teamId),
        this.props.fetchAllTeamRequests(),
      ])
        .then(() => {
          this.toggleSpinner();
        })
        .catch(() => {
          this.toggleSpinner();
        });
    });
  }

  progressBar() {
    if (this.props.currentTeam.goal > 0 && this.props.currentUser.teamId !== null) {
      return <ProgressBar team={this.props.currentTeam} onSubmit={this.onSubmit} />;
    } else {
      return (
        <div>
          <Button color="primary" name="set" className="mt-3 mb-2 mr-2" onClick={this.toggle}>
            Set Goal
          </Button>
          <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Create Progress Bar Goal">
            <ProgressModalBody
              onSubmit={this.onSubmit}
              team={this.props.currentTeam}
              modalClose={this.toggle}
              name="create"
            />
          </EventModal>
        </div>
      );
    }
  }

  leaveTeam = () => {
    const leaveTeam = { teamId: null };
    console.log(this.props.currentUser);
    const userObj = { ...this.props.currentUser, ...leaveTeam };
    this.props.editUser(userObj, this.props.currentUser.id).then(() => {
      this.props.fetchCurrentUser();
      this.toggleLeave();
    });
    this.props.fetchCurrentUser();
  };

  kickMember(user) {
    this.setState({ clickable: false });
    const teamId = { teamId: null, isFreeAgent: true };
    const kickUser = { ...user, ...teamId };
    this.props.editUser(kickUser, user.id).then(() => {
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
  checkMember(user) {
    if (user.id !== this.props.currentUser.id) {
      if (this.state.clickable === true) {
        return <Button onClick={() => this.kickMember(user)}> Kick </Button>;
      }
    } else if (this.state.clickable === true) {
      return (
        <React.Fragment>
          <Button color="secondary" className="mb-2" onClick={this.toggleLeave}>
            {' '}
            Leave Team
          </Button>
          <Modal isOpen={this.state.modalLeave}>
            <ModalBody>
              <div>
                Are you sure you wish to Leave the Team?
                <br />
                <br />
                Note: You will be giving the "Team Leader" role to the first person you recruited.
              </div>
              <ModalFooter>
                <Button color="primary" onClick={this.leaveTeam}>
                  Ok
                </Button>{' '}
                <Button color="secondary" onClick={this.toggleLeave}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalBody>
          </Modal>
        </React.Fragment>
      );
    }
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
        return user.teamId === this.props.currentTeam.id;
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
            <td>{this.checkMember(teamate)}</td>
          </tr>
        );
      });
    return users;
  }

  showTeamRequests() {
    var requests = this.props.allTeamRequests
      .filter(request => {
        return request.teamId === this.props.currentTeam.id;
      })
      .map(request => {
        return (
          <tr key={request.id}>
            <td>{this.props.user[request.userId].fname}</td>
            <td>{this.props.user[request.userId].lname}</td>
            <td>{this.props.region[this.props.user[request.userId].regionId].name}</td>
            <td>
              <Link to={`/profile/${this.props.user[request.userId].id}`}>
                <Button color="primary">View Profile</Button>
              </Link>
            </td>
            <td>
              <Button>Accept</Button>
              <Button>Reject</Button>
            </td>
          </tr>
        );
      });
    return requests;
  }

  teamInfo() {
    return (
      <div>
        <TitleForm
          initialValues={_.pick(this.props.currentTeam, 'name')}
          onSubmit={this.onSubmit}
          title="Team Name: "
        />
        <DescriptionForm initialValues={_.pick(this.props.currentTeam, 'description')} onSubmit={this.onSubmit} />
        <h2 className="mt-2">Progress: </h2>
        <div>{this.progressBar()}</div>
        <div>
          <h4>Members:</h4>
          <Table striped>
            <thead>
              <tr>
                <th>Names</th>
                <th>Lead</th>
                <th>Scores</th>
                <th>Profile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.showTeamMembers()}</tbody>
          </Table>
        </div>
        <div>
          <Table striped>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Region</th>
                <th>Profile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.showTeamRequests()}</tbody>
          </Table>
        </div>

        <Link to="/free_agents">
          <Button size="lg" color="primary">
            Find Free Agents
          </Button>
        </Link>
      </div>
    );
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
            <BreadcrumbItem active>Team</BreadcrumbItem>
          </Breadcrumb>
        </Row>
        <h1>
          Team Page <br />
        </h1>
        {this.decideRender()}
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  //console.log(ownProps);
  var parameter;
  if (!ownProps.match.params.id) {
    parameter = null;
  } else {
    parameter = parseInt(ownProps.match.params.id);
  }
  return {
    paramId: parameter,
    currentUser: state.currentUser,
    allTeamScores: state.allTeamScores,
    team: state.team,
    users: Object.values(state.users),
    roles: state.roles,
    currentTeam: state.currentTeam,
    currentRole: state.currentRole,
    allTeamRequests: state.allTeamRequests,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchCurrentUser,
    fetchTeam,
    editTeam,
    fetchUsers,
    fetchRoles,
    fetchCurrentTeam,
    fetchAllTeamRequests,
    editUser,
    fetchCurrentRole,
    fetchAllTeamScores,
  }
)(Team);
