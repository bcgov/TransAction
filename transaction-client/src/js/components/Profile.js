import React, { Component } from 'react';
import _ from 'lodash';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem, Progress, Button, Row, Col } from 'reactstrap';

import { fetchTeam, editUser, fetchAllUserScores, fetchEvents, fetchAllTeamScores, fetchUser } from '../actions';

import PageSpinner from './ui/PageSpinner';
import ProfileOfficeForm from './ProfileOfficeForm.js';
import DescriptionForm from './DescriptionForm';
import EventModal from './EventModal';
import CreateTeamModalBody from './CreateTeamModalBody';
import UserScoreGraphicCard from './UserScoreGraphicCard';
import ProfileReadOnly from './ProfileReadOnly';
import ProfileAdminView from './ProfileAdminView';
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
    userId = parseInt(userId);

    this.setState({ loading: true });

    this.props
      .fetchUser(userId)
      .then(() => {
        if (userId === this.props.currentUser.id || !userId) {
          this.setState({ canEdit: true, ownProfile: true });
        }

        // Allow admins to edit information
        if (this.props.currentUser.isAdmin) {
          this.setState({ canEdit: true });
        }

        if (this.state.ownProfile) {
          userId = this.props.currentUser.id;
        }

        this.setState({ userToDisplay: this.props.users.all[userId] });

        return this.props.fetchTeam(34);
      })
      .then(() => {
        this.setState({ teamToDisplay: this.props.teams.all[this.state.userToDisplay.teamId], loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });

    // Promise.all([
    //   // this.props.fetchAllUserScores(this.props.currentUser.id),
    //   // this.props.fetchAllTeamScores(this.props.currentUser.teamId),
    //   this.props.fetchUser(userId),
    //   this.props.fetchCurrentTeam(),
    // ])
    //   .then(() => {
    //     // User viewing own profile because param id equals currentuser.id
    //     // or param id not specified and therefore load currentuser
    //     if (userId === this.props.currentUser.id || !userId) {
    //       this.setState({ canEdit: true, ownProfile: true });
    //     }

    //     // Allow admins to edit information
    //     if (this.props.currentUser.isAdmin) {
    //       this.setState({ canEdit: true });
    //     }

    //     if (this.state.ownProfile) {
    //       userId = this.props.currentUser.id;
    //     }

    //     this.setState({ userToDisplay: this.props.users.all[userId], loading: false });
    //   })
    //   .catch(() => {
    //     this.setState({ loading: false });
    //   });
  };

  onSubmit = formValues => {
    const userObj = { ...this.props.currentUser, ...formValues };
    this.props.editUser(userObj, userObj.id).then(() => {
      this.props.fetchCurrentUser().then(() => {
        this.props.fetchAllTeamScores(this.props.currentUser.teamId);
      });
    });
  };

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
            regions={this.props.regions}
            onSubmit={this.onSubmit}
          />
        </h3>
        {this.printTeam()}

        <DescriptionForm initialValues={userToDisplay} onSubmit={this.onSubmit} />
        <Row className="mt-3 mb-3 "> {this.printUserScores()}</Row>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{`${this.props.currentUser.fname} ${this.props.currentUser.lname}`}</BreadcrumbItem>
          </Breadcrumb>
        </Row>
        <h1>Personal Profile </h1>
        <div>{this.decideRender()}</div>
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
    regions: Object.values(state.regions),
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
