import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem, Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { fetchTeam, editUser, fetchAllUserScores, fetchUser } from '../actions';
import PageSpinner from './ui/PageSpinner';
import EditUserForm from './forms/EditUserForm';

class Profile extends Component {
  state = {
    loading: true,
    canEdit: false,
    ownProfile: false,
    userToDisplay: null,
    userIdToDisplay: null,
    teamToDisplay: null,
    teamIdToDisplay: null,
    showEditUserForm: false,
    modal: false,
  };

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

        const teamId = this.props.users.all[userId].teamId;

        this.setState({ userIdToDisplay: userId, teamIdToDisplay: teamId });

        if (teamId) return Promise.all([this.props.fetchAllUserScores(userId), this.props.fetchTeam(teamId)]);
        else return this.props.fetchAllUserScores(userId);
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  showEditUserForm = () => {
    this.setState({ showEditUserForm: true });
  };

  toggleEditUserForm = () => {
    this.setState(prevState => ({
      showEditUserForm: !prevState.showEditUserForm,
    }));
  };

  renderUserInfo() {
    const userToDisplay = this.props.users.all[this.state.userIdToDisplay];

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
    const teamToDisplay = this.props.teams.all[this.state.teamIdToDisplay];

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
    const userToDisplay = this.props.users.all[this.state.userIdToDisplay];

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
            <BreadcrumbItem active>{userToDisplay && `${userToDisplay.fname} ${userToDisplay.lname}`}</BreadcrumbItem>
          </Breadcrumb>
        </Row>

        <Row className="mb-3">
          <Col xs="2">
            <h4>User Profile</h4>
          </Col>
          <Col>
            {(() => {
              if (this.state.canEdit && userToDisplay) {
                return (
                  <Button color="primary" size="sm" onClick={this.showEditUserForm}>
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
        <EditUserForm
          initialValues={userToDisplay}
          isOpen={this.state.showEditUserForm}
          toggle={this.toggleEditUserForm}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.current,
    users: state.users,
    regions: state.regions,
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
  }
)(Profile);
