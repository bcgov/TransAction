import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Container, Spinner, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchCurrentUser, fetchTeam, editTeam, fetchUsers, fetchRoles } from '../actions';
import DescriptionForm from './DescriptionForm';
import TitleForm from './TitleForm';
import ProgressBar from './ProgressBar';
import ProgressModalBody from './ProgressModalBody';
import EventModal from './EventModal';
import TeamReadOnly from './TeamReadOnly';
import TeamUserReadOnly from './TeamUserReadOnly';
import NoTeamPage from './NoTeamPage';

class Team extends Component {
  state = { loading: true, modal: false, currentTeam: {}, userRole: '' };
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
      //no paramId passed
      if (!this.props.paramId) {
        //we have no teamid and no id was passed as param; load choices
        if (!this.props.currentUser.teamId) {
          return <NoTeamPage />;
        }
        //Following the user's teamid
        else {
          //If they are a team lead or admin. Really wish the values for each role were sorted in order to prevent multiple checks
          if (this.state.userRole !== 'user') {
            return this.teamInfo();
          }
          //a regular user, therefor seeing his team in read only
          else {
            return <TeamUserReadOnly team={this.state.currentTeam} user={this.props.currentUser} />;
          }
        }
      }
      //paramId is passed
      else {
        //if the team id does not exist
        if (!this.state.currentTeam.id) {
          return <div>hmmmmmm.. we couldnt find that team :(</div>;
        }
        //if the paramId is the same as user teamid
        if (this.props.paramId === this.props.currentUser.teamId) {
          //If they are a team lead or admin
          if (this.state.userRole !== 'user') {
            return this.teamInfo();
          }
          //a regular user, therefor seeing his team in read only
          else {
            return <TeamUserReadOnly team={this.state.currentTeam} user={this.props.currentUser} />;
          }
        }
        //paramid is NOT the same as user teamid; viewing someones team from the outside
        else {
          //If they are an admin
          if (this.state.userRole === 'admin') {
            return this.teamInfo();
          } else {
            return <TeamReadOnly team={this.state.currentTeam} />;
          }
        }
      }
    }
  }

  onSubmit = formValues => {
    //console.log('passed in ', formValues);
    const userObj = { ...this.state.currentTeam, ...formValues };
    //console.log('now contain ', userObj);
    this.props.editTeam(userObj, this.state.currentTeam.id).then(() => {
      this.setState({ currentTeam: this.props.team[this.state.currentTeam.id] });
    });
  };

  componentDidMount() {
    // this.toggleSpinner();

    this.props.fetchCurrentUser('me').then(() => {
      const teamId = this.props.paramId ? this.props.paramId : this.props.currentUser.teamId;
      Promise.all([this.props.fetchTeam(teamId), this.props.fetchUsers(), this.props.fetchRoles()])
        .then(() => {
          // Don't do the next line.  Map it in mapstatetoprops
          this.setState({ currentTeam: this.props.team[teamId] });
          this.setState({ userRole: this.props.roles[this.props.currentUser.roleId].name });

          this.toggleSpinner();
        })
        .catch(() => {
          this.toggleSpinner();
        });
    });
  }

  progressBar() {
    if (this.state.currentTeam.progressbar === true && this.props.currentUser.teamId !== null) {
      return <ProgressBar team={this.state.currentTeam} onSubmit={this.onSubmit} />;
    } else {
      return (
        <div>
          <Button color="primary" name="set" className="mt-3 mb-2 mr-2" onClick={this.toggle}>
            Set Goal
          </Button>
          <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Create Progress Bar Goal">
            <ProgressModalBody
              onSubmit={this.onSubmit}
              team={this.state.currentTeam}
              modalClose={this.toggle}
              name="create"
            />
          </EventModal>
        </div>
      );
    }
  }

  checkUser(user) {
    if (user.teamId === this) return user;
  }

  showTeamMembers() {
    var users = this.props.users.filter(this.checkUser, this.state.currentTeam.id).map(teamate => {
      return (
        <div key={teamate.id}>
          {teamate.fname} {teamate.lname}
        </div>
      );
    });
    return users;
  }

  teamInfo() {
    return (
      <div>
        <TitleForm
          initialValues={_.pick(this.state.currentTeam, 'name')}
          onSubmit={this.onSubmit}
          title="Team Name: "
        />
        <DescriptionForm initialValues={_.pick(this.state.currentTeam, 'description')} onSubmit={this.onSubmit} />
        <h2 className="mt-2">Progress: </h2>
        <div>{this.progressBar()}</div>
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
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/teamslist">Teams List</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Team</BreadcrumbItem>
        </Breadcrumb>
        <h1>
          Team Page <br />
        </h1>
        {this.decideRender()}
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    paramId: parseInt(ownProps.match.params.id),
    currentUser: state.currentUser,
    team: state.team,
    users: Object.values(state.users),
    roles: Object.values(state.roles),
  };
};

export default connect(
  mapStateToProps,
  { fetchCurrentUser, fetchTeam, editTeam, fetchUsers, fetchRoles }
)(Team);
