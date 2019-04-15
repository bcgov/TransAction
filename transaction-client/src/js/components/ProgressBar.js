import React, { Component } from 'react';
import { Progress, Button } from 'reactstrap';
import EventModal from './EventModal';
import ProgressModalBody from './ProgressModalBody';

class ProgressBar extends Component {
  state = { modal: false };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  onDeleteBar = () => {
    const leaveAlert = window.confirm('Do you really want to delete the Progress Bar?');
    if (leaveAlert === true) {
      const bar = { progressbar: false };
      this.props.onSubmit(bar);
    }
  };

  progressButtons() {
    if (this.props.team.progressbar === true) {
      return (
        <div>
          <Button color="primary" className="mt-3 mb-2 mr-2" name="edit" onClick={this.toggle}>
            Edit Goal
          </Button>
          <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Edit Progress Bar Goal">
            <ProgressModalBody
              onSubmit={this.props.onSubmit}
              team={this.props.team}
              modalClose={this.toggle}
              name="edit"
            />
          </EventModal>
          <Button color="primary" className="mt-3 mb-2" name="remove" onClick={this.onDeleteBar}>
            Remove Goal
          </Button>
        </div>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="progress">
          <Progress bar animated color="primary" value={(this.props.team.progressamt / this.props.team.goal) * 100}>
            Check out this hot progress
          </Progress>
        </div>
        {this.progressButtons()}
      </React.Fragment>
    );
  }
}

export default ProgressBar;
