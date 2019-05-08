import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spinner, Button } from 'reactstrap';

import { fetchTeam } from '../actions';

class Profile extends Component {
  state = { loading: true, modal: false };

  componentDidMount() {
    Promise.all([this.props.fetchTeam(this.props.userToDisplay.teamId)])
      .then(() => {
        this.toggleSpinner();
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

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
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    } else {
      return this.userInfo();
    }
  }

  printTeam = () => {
    if (this.props.userToDisplay.teamId !== null) {
      return (
        <h3 className="mt-3">
          Team: {this.props.currentTeam.name}
          <Link to={`/team/${this.props.currentTeam.id}`}>
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
          Name: {this.props.userToDisplay.fname} {this.props.userToDisplay.lname}{' '}
        </h3>
        <h3>Region: {this.findRegion(this.props.userToDisplay.regionId)}</h3>
        {this.printTeam()}
        <div>{this.props.userToDisplay.description}</div>
      </div>
    );
  }

  render() {
    return <div>{this.decideRender()}</div>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentTeam: state.teams.all[ownProps.userToDisplay.teamId],
    regions: Object.values(state.regions),
  };
};

export default connect(
  mapStateToProps,
  { fetchTeam }
)(Profile);
