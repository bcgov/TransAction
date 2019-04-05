import React, { Component } from 'react';
import ProfileOfficeForm from './ProfileOfficeForm.js';
import _ from 'lodash';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem, Container, Progress, Spinner } from 'reactstrap';
import { fetchUser, fetchTeam, editUserDescription, fetchRegions } from '../actions';
import ProfileDescriptionForm from './ProfileDescriptionForm';

class Profile extends Component {
  state = { isSpin: true };
  toggleSpinner = () => {
    this.setState(prevState => ({
      isSpin: !prevState.isSpin,
    }));
  };

  decideRender() {
    if (this.state.isSpin === true) {
      //console.log('spin');
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    } else {
      return this.userInfo();
    }
  }

  componentDidMount() {
    // this.toggleSpinner();
    this.props.fetchUser(this.toggleSpinner);
    this.props.fetchRegions();
  }

  findTeam() {
    if (this.props.user.teamid === null) return 'No team!';
    else return this.props.team.name;
  }

  onSubmit = formValues => {
    //console.log('passed in ', formValues);
    const userObj = { ...this.props.user, ...formValues };
    //console.log('now contain ', userObj);
    this.props.editUserDescription(userObj);
  };

  progressBar() {
    if (this.props.team.progressbar === true) {
      return (
        <Progress bar animated color="primary" value={this.props.team.progressamt}>
          Check out this hot progress
        </Progress>
      );
    }
  }

  userInfo() {
    console.log(this.props.user.region);
    return (
      <Container className=" px-3 mx-3 mb-4">
        <h3>Name: {this.props.user.name}</h3>
        <h3>
          <ProfileOfficeForm
            initialValues={_.pick(this.props.user, 'region')}
            userRegion={this.props.user.region}
            regions={this.props.regions}
            onSubmit={this.onSubmit}
          />
        </h3>

        <h3 className="mt-3">Team: {this.findTeam()}</h3>
        <div className="progress">{this.progressBar()}</div>
        <ProfileDescriptionForm initialValues={_.pick(this.props.user, 'description')} onSubmit={this.onSubmit} />
      </Container>
    );
  }

  render() {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>MyProfile</BreadcrumbItem>
        </Breadcrumb>
        <h1 className=" px-3 mx-3 mb-4"> Personal Profile </h1>

        <div>{this.decideRender()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  //console.log(state.user);
  return { user: state.user, team: state.team, regions: Object.values(state.regions) };
};

export default connect(
  mapStateToProps,
  { fetchUser, fetchTeam, editUserDescription, fetchRegions }
)(Profile);
