import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchCurrentUser } from '../actions';
import EventModal from './EventModal';
import CreateTeamModalBody from './CreateTeamModalBody';

class NoTeamPage extends Component {
  state = { modal: false };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  render() {
    return (
      <React.Fragment>
        <h3 className="mt-3">Oh no! You have no Team! Lets fix that:</h3>
        <Link to="/teamslist">
          <Button size="lg" color="primary" className="mr-3 mb-2">
            {' '}
            Find Team
          </Button>
        </Link>
        <Button size="lg" color="primary" className="mb-2" onClick={this.toggle}>
          {' '}
          Create Team
        </Button>
        <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Create a Team!">
          <CreateTeamModalBody onSubmit={this.onSubmit} modalClose={this.toggle} name="create" />
        </EventModal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return { currentUser: state.currentUser };
};

export default connect(
  mapStateToProps,
  { fetchCurrentUser }
)(NoTeamPage);
