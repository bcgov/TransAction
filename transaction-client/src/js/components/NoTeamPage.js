import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchCurrentUser, editUser } from '../actions';
import EventModal from './EventModal';
import CreateTeamModalBody from './CreateTeamModalBody';

class NoTeamPage extends Component {
  state = { modal: false, redirect: false, modalAgent: false };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  toggleAgent = () => {
    this.setState(prevState => ({
      modalAgent: !prevState.modalAgent,
    }));
  };

  confirmFreeAgent = () => {
    const agentFlag = { isFreeAgent: true };
    const userObj = { ...this.props.currentUser, ...agentFlag };
    this.props.editUser(userObj, 'me').then(() => {
      this.props.fetchCurrentUser();
      this.toggleAgent();
    });
  };

  confirmRemoveFreeAgent = () => {
    const agentFlag = { isFreeAgent: false };
    const userObj = { ...this.props.currentUser, ...agentFlag };
    this.props.editUser(userObj, 'me').then(() => {
      this.props.fetchCurrentUser();
      this.toggleAgent();
    });
    this.props.fetchCurrentUser();
  };

  componentDidMount() {
    Promise.all([this.props.fetchCurrentUser()]);
  }

  showFreeAgent() {
    if (this.props.currentUser.isFreeAgent === false) {
      return (
        <div>
          <h4>Forget descisions, let a team lead find you!</h4>
          <Button size="lg" color="primary" className="mb-2" onClick={this.toggleAgent}>
            {' '}
            Become a Free Agent!
          </Button>
          <Modal isOpen={this.state.modalAgent}>
            <ModalBody>
              <div>
                Are you sure you wish to become a free agent?
                <br />
                <br />
                Note: This will allow other team leaders to recruit you without any input from you.
              </div>
              <ModalFooter>
                <Button color="primary" onClick={this.confirmFreeAgent}>
                  Ok
                </Button>{' '}
                <Button color="secondary" onClick={this.toggleAgent}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalBody>
          </Modal>
        </div>
      );
    } else {
      return (
        <div>
          <h4>You are currently a Free Agent.</h4>
          <Button size="lg" color="primary" className="mb-2" onClick={this.toggleAgent}>
            {' '}
            Remove me as a Free Agent
          </Button>
          <Modal isOpen={this.state.modalAgent}>
            <ModalBody>
              <div>
                Are you sure you wish to stop being a free agent?
                <br />
                <br />
                Note: You will have to create your own team or join one to have your points count towards an event.
              </div>
              <ModalFooter>
                <Button color="primary" onClick={this.confirmRemoveFreeAgent}>
                  Ok
                </Button>{' '}
                <Button color="secondary" onClick={this.toggleAgent}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalBody>
          </Modal>
        </div>
      );
    }
  }

  render() {
    if (this.state.redirect === true) {
      return <Redirect to={`/profile`} />;
    } else {
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
          {this.showFreeAgent()}
        </React.Fragment>
      );
    }
  }
}
const mapStateToProps = state => {
  return { currentUser: state.currentUser };
};

export default connect(
  mapStateToProps,
  { fetchCurrentUser, editUser }
)(NoTeamPage);
