import React, { Component } from 'react';
import ProfileOfficeForm from './ProfileOfficeForm.js';
import _ from 'lodash';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem, Container, Progress, Spinner, Button } from 'reactstrap';
import { fetchUser, fetchTeam, editUser, fetchRegions } from '../actions';
import DescriptionForm from './DescriptionForm';
import EventModal from './EventModal';
import CreateTeamModalBody from './CreateTeamModalBody';

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
      // console.log('looking for user with id: ', this.props.user);
      if (!this.props.user.id) return <div>Hmmmm, We couldnt find that user :(</div>;
      else return this.userInfo();
    }
  }

  componentDidMount() {
    // this.toggleSpinner();
    Promise.all([this.props.fetchUser(this.props.id), this.props.fetchRegions()])
      .then(() => {
        this.props.fetchTeam(this.props.user.teamid);
      })
      .then(() => {
        this.toggleSpinner();
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

  onSubmit = formValues => {
    //console.log('passed in ', formValues);
    const userObj = { ...this.props.user, ...formValues };
    //console.log('now contain ', userObj);
    this.props.editUser(userObj, 'me');
  };

  progressBar() {
    if (this.props.team.progressbar === true && this.props.user.teamid !== null) {
      return (
        <Progress bar animated color="primary" value={(this.props.team.progressamt / this.props.team.goal) * 100}>
          Check out this hot progress
        </Progress>
      );
    }
  }

  leaveTeam = () => {
    const leaveAlert = window.confirm('Do you really want to leave the team?');
    if (leaveAlert === true) {
      const team = { teamid: null };
      this.onSubmit(team);
    }
  };

  //TODO Button logic
  printTeam = () => {
    if (this.props.user.teamid !== null) {
      return (
        <h3 className="mt-3">
          Team: {this.props.team.name}
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
              user={this.props.user}
              modalClose={this.toggle}
              name="create"
            />
          </EventModal>
        </h3>
      );
    }
  };

  userInfo() {
    return (
      <div>
        <h3>Name: {this.props.user.name}</h3>
        <h3>
          <ProfileOfficeForm
            initialValues={_.pick(this.props.user, 'region')}
            userRegion={this.props.user.region}
            regions={this.props.regions}
            onSubmit={this.onSubmit}
          />
        </h3>
        {this.printTeam()}
        <h3>Team Progress: </h3>
        <div className="progress">{this.progressBar()}</div>
        <DescriptionForm initialValues={_.pick(this.props.user, 'description')} onSubmit={this.onSubmit} />
      </div>
    );
  }

  render() {
    //console.log(this.props);
    return (
      <Container>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>MyProfile</BreadcrumbItem>
        </Breadcrumb>
        <h1>Personal Profile </h1>
        <div>{this.decideRender()}</div>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var who;
  if (!ownProps.match.params.id) who = 'me';
  else who = ownProps.match.params.id;
  //check to see if params.id exists, if not return "me"
  return { id: who, user: state.user, team: state.team, regions: Object.values(state.regions) };
};

export default connect(
  mapStateToProps,
  { fetchUser, fetchTeam, editUser, fetchRegions }
)(Profile);
