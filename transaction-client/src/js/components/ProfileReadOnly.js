import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Spinner, Button } from 'reactstrap';
import {
  fetchCurrentUser,
  fetchTeam,
  editUser,
  fetchRegions,
  fetchAllUserScores,
  fetchEvents,
  fetchRoles,
  fetchUser,
} from '../actions';

class Profile extends Component {
  state = { loading: true, modal: false, currentTeam: {} };
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
      return this.userInfo();
    }
  }

  componentDidMount() {
    // this.toggleSpinner();
    this.props.fetchEvents();
    this.props.fetchCurrentUser('me');
    this.props
      .fetchUser(this.props.userId)
      .then(() => {
        const teamId = this.props.user.teamId;
        Promise.all([this.props.fetchRegions(), this.props.fetchTeam(this.props.user.teamId)])
          .then(() => {
            this.setState({ currentTeam: this.props.team[teamId] });
            this.toggleSpinner();
          })
          .catch(() => {
            this.toggleSpinner();
          });
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

  printTeam = () => {
    if (this.props.user.teamId !== null) {
      return (
        <h3 className="mt-3">
          Team: {this.state.currentTeam.name}
          <Link to="/team">
            <Button color="primary" className="ml-3 mb-2">
              Visit Team
            </Button>
          </Link>
        </h3>
      );
    } else {
      return <h3 className="mt-3">Team: No Team!</h3>;
    }
  };

  findRegion(userRegionId) {
    let regionName = '';
    this.props.regions.forEach(element => {
      if (parseInt(userRegionId) === element.id) {
        regionName = element.name;
      }
    });
    return regionName;
  }

  userInfo() {
    return (
      <div>
        <h3>
          Name: {this.props.user.fname} {this.props.user.lname}{' '}
        </h3>
        <h3>Region: {this.findRegion(this.props.user.regionId)}</h3>
        {this.printTeam()}
        <div>{this.props.user.description}</div>
      </div>
    );
  }

  render() {
    return (
      <Container>
        <div>{this.decideRender()}</div>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    user: state.users,
    team: state.team,
    regions: Object.values(state.regions),
    allUserScores: Object.values(state.allUserScores),
    events: Object.values(state.events),
    roles: Object.values(state.roles),
  };
};

export default connect(
  mapStateToProps,
  { fetchCurrentUser, fetchTeam, editUser, fetchRegions, fetchAllUserScores, fetchEvents, fetchRoles, fetchUser }
)(Profile);
