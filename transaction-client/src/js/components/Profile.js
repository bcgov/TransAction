import React, { Component } from 'react';
//import _ from 'lodash';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem, Progress, Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { fetchTeam, editUser, fetchAllUserScores, fetchEvents, fetchAllTeamScores, fetchUser } from '../actions';

import PageSpinner from './ui/PageSpinner';
import ProfileOfficeForm from './ProfileOfficeForm.js';
import DescriptionForm from './DescriptionForm';
import EventModal from './EventModal';
import CreateTeamModalBody from './CreateTeamModalBody';
import UserScoreGraphicCard from './UserScoreGraphicCard';
// import ProfileReadOnly from './ProfileReadOnly';
// import ProfileAdminView from './ProfileAdminView';
class Profile extends Component {
  state = { loading: true, canEdit: false, ownProfile: false, userToDisplay: null, teamToDisplay: null, modal: false };

  componentDidMount() {
    this.init(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    // Re-init if URL param has changed
    const prevId = prevProps.match.params.id;
    const currId = this.props.match.params.id;
    if (currId !== prevId && parseInt(prevId) !== this.props.currentUser.id) {
      this.init(currId);
    }
  }

  init = userId => {
    this.setState({ loading: true, canEdit: false, ownProfile: false });

    if (this.props.currentUser.isAdmin) {
      this.setState({ canEdit: true });
    }

    userId = parseInt(userId);

    this.props
      .fetchUser(userId)
      .then(() => {
        if (userId === this.props.currentUser.id || !userId) {
          userId = this.props.currentUser.id;
          this.setState({ canEdit: true, ownProfile: true });
        }

        this.setState({ userToDisplay: this.props.users.all[userId] });

        return this.props.fetchTeam(this.state.userToDisplay.teamId);
      })
      .then(() => {
        const teamToDisplay = this.props.teams.all[this.state.userToDisplay.teamId];
        this.setState({ teamToDisplay, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  onSubmit = formValues => {
    const userObj = { ...this.props.currentUser, ...formValues };
    this.props.editUser(userObj, userObj.id).then(() => {
      this.props.fetchCurrentUser().then(() => {
        this.props.fetchAllTeamScores(this.props.currentUser.teamId);
      });
    });
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  decideRender() {
    if (this.state.loading) {
      return <PageSpinner />;
    } else {
      if (!this.state.userToDisplay) return <div>Hmmmm, We couldnt find that user :(</div>;
      //Loading DONE
      else {
        //no userParamId passed
        // if (this.state.ownProfile) {
        //   return this.userInfo();
        // } else if (this.state.canEdit) {
        //   return <ProfileAdminView userId={this.props.userParamId} userToDisplay={this.state.userToDisplay} />;
        // } else {
        //   return <ProfileReadOnly userId={this.props.userParamId} userToDisplay={this.state.userToDisplay} />;
        // }
        return this.userInfo();
      }
    }
  }

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
    if (this.state.teamToDisplay.goal > 0 && this.props.currentUser.teamId !== null) {
      return (
        <Progress
          bar
          animated
          color="primary"
          value={(this.state.teamToDisplay.progressamt / this.state.teamToDisplay.goal) * 100}
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
    if (this.state.teamToDisplay) {
      return (
        <h3 className="mt-3">
          Team: {this.state.teamToDisplay.name}
          <Link to={`/team/${this.state.teamToDisplay.id}`}>
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
    this.props.allTeamScores.forEach(element => {
      if (element.eventId === eventId) {
        score = element.score;
      }
    });
    return score;
  }

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
    const userToDisplay = this.state.userToDisplay;
    return (
      <div>
        <h3>
          Name: {userToDisplay.fname} {userToDisplay.lname}{' '}
        </h3>
        <h3>
          <ProfileOfficeForm
            initialValues={userToDisplay}
            userRegion={userToDisplay.regionId}
            regions={Object.values(this.props.regions)}
            onSubmit={this.onSubmit}
          />
        </h3>
        {this.printTeam()}

        <DescriptionForm initialValues={userToDisplay} onSubmit={this.onSubmit} />
        <Row className="mt-3 mb-3 "> {this.printUserScores()}</Row>
      </div>
    );
  }

  renderUserInfo() {
    const userToDisplay = this.state.userToDisplay;

    return (
      <React.Fragment>
        <Row>
          <Col xs="12" lg="6">
            <div>
              {' '}
              <strong>Name</strong>
            </div>
            <div>
              {userToDisplay.fname} {userToDisplay.lname}
            </div>
          </Col>
          <Col xs="12" lg="6">
            <div>
              {' '}
              <strong>Region</strong>
            </div>
            <div>{this.props.regions[userToDisplay.regionId].name}</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              {' '}
              <strong>Description</strong>
            </div>
            <div>{userToDisplay.description}</div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  renderUserTeam() {
    const teamToDisplay = this.state.teamToDisplay;

    return (
      <Row className="mb-5">
        <Col>
          {(() => {
            if (!teamToDisplay) {
              if (this.state.ownProfile)
                return (
                  <React.Fragment>
                    <div className="mb-3">You are currently not on a team. You have the following options:</div>
                    <div>
                      <Link to="/">
                        <Button color="primary" size="sm">
                          Create Team
                        </Button>
                      </Link>{' '}
                      or{' '}
                      <Link to="/">
                        <Button color="primary" size="sm">
                          Join Team
                        </Button>
                      </Link>
                    </div>
                  </React.Fragment>
                );
              else return <p>{this.state.userToDisplay.fname} is not part of a team.</p>;
            } else
              return (
                <React.Fragment>
                  <Row>
                    <Col>
                      <div>
                        {' '}
                        <strong>Name</strong>
                      </div>
                      <div>
                        <Link to={`/team/${teamToDisplay.id}`}>
                          {teamToDisplay.name} <FontAwesomeIcon icon="external-link-alt" />
                        </Link>
                      </div>
                    </Col>
                    <Col>
                      <div>
                        {' '}
                        <strong>Region</strong>
                      </div>
                      <div>{this.props.regions[teamToDisplay.regionId].name}</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div>
                        {' '}
                        <strong>Description</strong>
                      </div>
                      <div>{teamToDisplay.description}</div>
                    </Col>
                  </Row>
                </React.Fragment>
              );
          })()}
        </Col>
      </Row>
    );
  }

  render() {
    const userToDisplay = this.state.userToDisplay;

    return (
      <React.Fragment>
        <Row>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/profile">Profile</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              {userToDisplay ? `${userToDisplay.fname} ${userToDisplay.lname}` : ''}
            </BreadcrumbItem>
          </Breadcrumb>
        </Row>

        {/* <div>{this.decideRender()}</div> */}
        <Row className="mb-3">
          <Col xs="2">
            <h4>User Profile</h4>
          </Col>
          <Col>
            {(() => {
              if (this.state.ownProfile && userToDisplay && userToDisplay.teamId) {
                return (
                  <Button color="primary" size="sm">
                    Edit Profile
                  </Button>
                );
              }
            })()}
          </Col>
        </Row>

        {this.state.loading ? <PageSpinner /> : this.renderUserInfo()}
        <hr />
        <Row className="mb-3">
          <Col xs="2">
            <h4>Team</h4>
          </Col>
          <Col>
            {(() => {
              if (this.state.ownProfile && userToDisplay && userToDisplay.teamId) {
                return (
                  <Button color="danger" size="sm">
                    Leave Team
                  </Button>
                );
              }
            })()}
          </Col>
        </Row>
        {this.state.loading ? <PageSpinner /> : this.renderUserTeam()}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userParamId: parseInt(ownProps.match.params.id),
    currentUser: state.users.current,
    users: state.users,
    // team: state.team,
    regions: state.regions,
    allUserScores: Object.values(state.allUserScores),
    allTeamScores: Object.values(state.allTeamScores),
    events: Object.values(state.events),
    roles: state.roles,
    teams: state.teams,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchUser,
    fetchTeam,
    editUser,
    fetchAllUserScores,
    fetchAllTeamScores,
    fetchEvents,
  }
)(Profile);
