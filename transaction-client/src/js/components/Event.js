import React from 'react';
import { Row, Col, ButtonGroup, Button } from 'reactstrap';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import EventModal from './EventModal';
import EventModalBody from './EventModalBody';
import { fetchCurrentUser, fetchRoles, fetchCurrentRole } from '../actions';

class Event extends React.Component {
  state = { modal: false, redirect: false, redirectId: 0 };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  componentDidMount() {
    Promise.all([this.props.fetchRoles(), this.props.fetchCurrentUser()]).then(() => {
      this.props.fetchCurrentRole(this.props.currentUser.roleId);
    });
  }
  redirect(id) {
    this.setState({ redirect: true, redirectId: id });
  }

  checkAdmin() {
    if (this.props.currentRole.name === 'Admin') {
      return (
        <React.Fragment>
          <ButtonGroup className="float-right">
            <Button color="primary" onClick={this.toggle}>
              Edit Event
            </Button>
            <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Edit an Event">
              {' '}
              <EventModalBody modalClose={this.toggle} name="edit" id={this.props.event.id} />
            </EventModal>
          </ButtonGroup>
        </React.Fragment>
      );
    }
  }

  render() {
    //TODO show/hide logic needed using end dates
    if (this.state.redirect) {
      return <Redirect to={`/event/${this.state.redirectId}`} />;
    } else {
      return (
        <React.Fragment>
          <Row>
            <Col>
              <h3 className="event float-left" onClick={() => this.redirect(this.props.event.id)}>
                {this.props.event.name}
              </h3>
              {this.checkAdmin()}
            </Col>
          </Row>
          <div className="float-left float-none mb-4">
            {moment(this.props.event.startDate).format('MMMM Do YYYY')} To{' '}
            {moment(this.props.event.endDate).format('MMMM Do YYYY')}
          </div>
          <div>{this.props.event.description}</div>
        </React.Fragment>
      );
    }
  }
}

const mapStateToProps = state => {
  return { currentUser: state.currentUser, roles: Object.values(state.roles), currentRole: state.currentRole };
};

export default connect(
  mapStateToProps,
  { fetchRoles, fetchCurrentUser, fetchCurrentRole }
)(Event);
