import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Container, Spinner, Button, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchUser, fetchTeam, editTeam, fetchUsers } from '../actions';
import DescriptionForm from './DescriptionForm';
import TitleForm from './TitleForm';
import ProgressBar from './ProgressBar';
import ProgressModalBody from './ProgressModalBody';
import EventModal from './EventModal';
import TeamReadOnly from './TeamReadOnly';
import TeamUserReadOnly from './TeamUserReadOnly';
import NoTeamPage from './NoTeamPage';

class Team extends Component {
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
      if (!this.props.paramid) {
        //we have no teamid and no id was passed as param; load choices
        if (!this.props.user.teamid) {
          return <NoTeamPage />;
        }
        //Following the user's teamid
        else {
          //If they are a team lead or admin
          if (this.props.user.role !== 'user') {
            return this.teamInfo();
          }
          //a regular user, therefor seeing his team in read only
          else {
            return <TeamUserReadOnly team={this.props.team} user={this.props.user} />;
          }
        }
      }
      //paramId is passed
      else {
        //if the team id does not exist
        if (!this.props.team.id) {
          return <div>hmmmmmm.. we couldnt find that team :(</div>;
        }
        //if the paramId is the same as user teamid
        if (this.props.paramid === this.props.user.teamid) {
          //If they are a team lead or admin
          if (this.props.user.role !== 'user') {
            return this.teamInfo();
          }
          //a regular user, therefor seeing his team in read only
          else {
            return <TeamUserReadOnly team={this.props.team} user={this.props.user} />;
          }
        }
        //paramid is NOT the same as user teamid; viewing someones team from the outside
        else {
          return <TeamReadOnly team={this.props.team} />;
        }
      }
    }
  }

  onSubmit = formValues => {
    //console.log('passed in ', formValues);
    const userObj = { ...this.props.team, ...formValues };
    //console.log('now contain ', userObj);
    this.props.editTeam(userObj, this.props.team.id);
  };

  componentDidMount() {
    // this.toggleSpinner();

    this.props
      .fetchUser('me')
      .then(() => {
        const teamid = this.props.paramid ? this.props.paramid : this.props.user.teamid;
        Promise.all([this.props.fetchTeam(teamid), this.props.fetchUsers()]);
      })
      .then(() => {
        this.toggleSpinner();
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

  progressBar() {
    if (this.props.team.progressbar === true && this.props.user.teamid !== null) {
      return <ProgressBar team={this.props.team} onSubmit={this.onSubmit} />;
    } else {
      return (
        <div>
          <Button color="primary" name="set" className="mt-3 mb-2 mr-2" onClick={this.toggle}>
            Set Goal
          </Button>
          <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Create Progress Bar Goal">
            <ProgressModalBody onSubmit={this.onSubmit} team={this.props.team} modalClose={this.toggle} name="create" />
          </EventModal>
        </div>
      );
    }
  }

  showTeamMembers() {
    const users = this.props.users.map(teamate => {
      //console.log(teamate);
      if (teamate.teamid === this.props.team.id) return <div key={teamate.id}>{teamate.name}</div>;
    });
    return users;
  }

  onSubmit = formValues => {
    //console.log('passed in ', formValues);
    const teamObj = { ...this.props.team, ...formValues };
    console.log('now contain ', teamObj);
    this.props.editTeam(teamObj, this.props.team.id);
  };

  teamInfo() {
    console.log(_.pick(this.props.team, 'description'));
    return (
      <div>
        <TitleForm initialValues={_.pick(this.props.team, 'name')} onSubmit={this.onSubmit} title="Team Name: " />
        <DescriptionForm initialValues={_.pick(this.props.team, 'description')} onSubmit={this.onSubmit} />
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
        <h1> Team</h1>
        {this.decideRender()}
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log(ownProps);
  return {
    paramid: parseInt(ownProps.match.params.id),
    user: state.user,
    team: state.team,
    users: Object.values(state.users),
  };
};

export default connect(
  mapStateToProps,
  { fetchUser, fetchTeam, editTeam, fetchUsers }
)(Team);
