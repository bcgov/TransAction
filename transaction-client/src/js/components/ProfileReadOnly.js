import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem, Container, Spinner, Button } from 'reactstrap';
import { fetchUser, fetchTeam, editUser, fetchRegions, fetchAllUserScores, fetchEvents, fetchRoles } from '../actions';

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
    this.props
      .fetchUser(this.props.paramId)
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

  //TODO Button logic
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
      if (userRegionId === element.id) regionName = element.name;
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
    console.log('In read only mode');
    return (
      <Container>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            {this.props.user.fname} {this.props.user.lname}'s Profile
          </BreadcrumbItem>
        </Breadcrumb>
        <h1>Personal Profile </h1>
        <div>{this.decideRender()}</div>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var who;
  //check to see if params.id exists, if not return "me"
  if (!ownProps.match.params.id) who = 'me';
  else who = ownProps.match.params.id;

  return {
    paramId: who,
    user: state.user,
    team: state.team,
    regions: Object.values(state.regions),
    allUserScores: Object.values(state.allUserScores),
    events: Object.values(state.events),
    roles: Object.values(state.roles),
  };
};

export default connect(
  mapStateToProps,
  { fetchUser, fetchTeam, editUser, fetchRegions, fetchAllUserScores, fetchEvents, fetchRoles }
)(Profile);
