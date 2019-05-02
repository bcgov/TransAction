import React, { Component } from 'react';
import ProfileOfficeForm from './ProfileOfficeForm.js';
import _ from 'lodash';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem, Container, Progress, Spinner, Button, Row, Col } from 'reactstrap';
import {
  fetchCurrentUser,
  fetchTeam,
  editUser,
  fetchRegions,
  fetchAllUserScores,
  fetchEvents,
  fetchRoles,
  fetchCurrentRole,
  fetchAllTeamScores,
} from '../actions';
import DescriptionForm from './DescriptionForm';
import EventModal from './EventModal';
import CreateTeamModalBody from './CreateTeamModalBody';
import UserScoreGraphicCard from './UserScoreGraphicCard';
import ProfileReadOnly from './ProfileReadOnly';
import ProfileAdminView from './ProfileAdminView';

class Profile extends Component {
  state = { loading: true, modal: false };
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

  decideRender() {
    if (this.state.loading) {
      //console.log('spin');
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    } else {
      if (!this.props.currentUser.id) return <div>Hmmmm, We couldnt find that user :(</div>;
      //Loading DONE
      else {
        //no paramId passed
        if (!this.props.paramId) {
          //Following the user's profile
          //Doesnt matter what the role is, its the users profile.
          console.log('no param its our profile');
          return this.userInfo();
        }
        //paramId is passed
        else {
          console.log('param Id passed');
          console.log(this.props.currentRole);
          console.log(this.props.paramId);
          console.log(this.props.currentUser.id);
          //if the paramId is the same as user profileid
          if (this.props.paramId === this.props.currentUser.id) {
            //role doesnt matter, its the users page
            return this.userInfo();
          }
          //paramid is NOT the same as user id; viewing someones profile from the outside
          else {
            //If they are an admin

            if (this.props.currentRole.name === 'admin') {
              console.log('we are admin');
              return <ProfileAdminView userId={this.props.paramId} />;
            } else {
              //return read only
              console.log('we are ', this.state.userRole, ' returning read only');
              return <ProfileReadOnly userId={this.props.paramId} />;
            }
          }
        }
      }
    }
  }

  componentDidMount() {
    //NOTE: I dont know why i need to nest things like this, but it doesnt work without it
    Promise.all([this.props.fetchEvents(), this.props.fetchRoles(), this.props.fetchCurrentUser()])
      .then(() => {
        Promise.all([
          this.props.fetchAllUserScores(this.props.currentUser.id),
          this.props.fetchAllTeamScores(this.props.currentUser.teamId),
          this.props.fetchRegions(),
          this.props.fetchTeam(this.props.currentUser.teamId),
          this.props.fetchCurrentTeam(this.props.currentUser.teadId),
          this.props.fetchCurrentRole(this.props.currentUser.roleId),
        ])
          .then(() => {
            this.toggleSpinner();
          })
          .catch(() => {
            console.log('ERROR');
            this.toggleSpinner();
          });
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

  onSubmit = formValues => {
    //console.log('passed in ', formValues);
    const userObj = { ...this.props.currentUser, ...formValues };
    console.log('now contain ', userObj);
    this.props.editUser(userObj, userObj.id).then(() => {
      this.props.fetchCurrentUser();
    });
  };

  printProgress() {
    if (this.props.currentUser.teamId !== null) {
      return (
        <React.Fragment>
          <h3>Team Progress: </h3>
          <div id="progress">{this.progressBar()}</div>
        </React.Fragment>
      );
    }
  }

  progressBar() {
    if (this.props.currentTeam.goal > 0 && this.props.currentUser.teamId !== null) {
      return (
        <Progress
          bar
          animated
          color="primary"
          value={(this.props.currentTeam.progressamt / this.props.currentTeam.goal) * 100}
        >
          Check out this hot progress
        </Progress>
      );
    }
  }

  leaveTeam = () => {
    const leaveAlert = window.confirm('Do you really want to leave the team?');
    if (leaveAlert === true) {
      const team = { teamId: null };
      this.onSubmit(team);
    }
  };

  //TODO Button logic
  printTeam = () => {
    if (this.props.currentUser.teamId !== null) {
      return (
        <h3 className="mt-3">
          Team: {this.props.currentTeam.name}
          <Link to="/team">
            <Button color="primary" className="ml-3 mb-2">
              Visit Team
            </Button>
          </Link>
          <Button color="secondary" className="ml-3 mb-2" onClick={this.leaveTeam}>
            {' '}
            Leave Team
          </Button>
        </h3>
      );
    } else {
      return (
        <h3 className="mt-3">
          Team: No Team!
          <Link to="/teamslist">
            <Button color="primary" className="ml-3 mb-2">
              {' '}
              Find Team
            </Button>
          </Link>
          <Button color="primary" className="ml-3 mb-2" onClick={this.toggle}>
            {' '}
            Create Team
          </Button>
          <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Create a Team!">
            <CreateTeamModalBody
              onSubmit={this.onSubmit}
              user={this.props.currentUser}
              modalClose={this.toggle}
              name="create"
            />
          </EventModal>
        </h3>
      );
    }
  };

  findEventName(id) {
    var name = '';
    this.props.events.forEach(element => {
      if (element.id === id) {
        name = element.name;
      }
    });
    return name;
  }

  findTeamEventScore(eventId) {
    var score = -1;
    this.props.allTeamScores.map(element => {
      if (element.eventId === eventId) {
        score = element.score;
      }
    });
    return score;
  }

  //**TODO, REMOVE HARDCODED TEAM VALUES**
  printUserScores() {
    const scores = this.props.allUserScores.map(element => (
      <Col key={element.eventId}>
        <UserScoreGraphicCard
          userScore={element.score}
          //hardcoded value needs to change
          teamScore={this.findTeamEventScore(element.eventId)}
          name={this.findEventName(element.eventId)}
          type="profile"
        />
      </Col>
    ));
    return scores;
  }

  userInfo() {
    return (
      <div>
        <h3>
          Name: {this.props.currentUser.fname} {this.props.currentUser.lname}{' '}
        </h3>
        <h3>
          <ProfileOfficeForm
            initialValues={_.pick(this.props.currentUser, 'regionId')}
            userRegion={this.props.currentUser.regionId}
            regions={this.props.regions}
            onSubmit={this.onSubmit}
          />
        </h3>
        {this.printTeam()}

        <DescriptionForm initialValues={_.pick(this.props.currentUser, 'description')} onSubmit={this.onSubmit} />
        <Row className="mt-3 mb-3 "> {this.printUserScores()}</Row>
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
            <BreadcrumbItem active>MyProfile</BreadcrumbItem>
          </Breadcrumb>
        </Row>
        <h1>Personal Profile </h1>
        <div>{this.decideRender()}</div>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    paramId: parseInt(ownProps.match.params.id),
    currentUser: state.currentUser,
    team: state.team,
    regions: Object.values(state.regions),
    allUserScores: Object.values(state.allUserScores),
    allTeamScores: Object.values(state.allTeamScores),
    events: Object.values(state.events),
    roles: state.roles,
    currentRole: state.currentRole,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchCurrentUser,
    fetchTeam,
    editUser,
    fetchRegions,
    fetchAllUserScores,
    fetchAllTeamScores,
    fetchEvents,
    fetchRoles,
    fetchCurrentRole,
  }
)(Profile);
