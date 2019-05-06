import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, ButtonGroup, Button } from 'reactstrap';
import moment from 'moment';

import EventModal from './EventModal';
import EventModalBody from './EventModalBody';
import * as Constants from '../Constants';

class Event extends React.Component {
  state = { modal: false, redirect: false, redirectId: 0 };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  redirect(id) {
    this.setState({ redirect: true, redirectId: id });
  }

  checkAdmin() {
    if (this.props.currentUser.roleName === Constants.ROLE.ADMIN) {
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
    return (
      <React.Fragment>
        <Row>
          <Col>
            <Link to={`/event/${this.props.event.id}`} className="h3">
              {this.props.event.name}
            </Link>
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

const mapStateToProps = state => {
  return {
    currentUser: state.users.current,
  };
};

export default connect(
  mapStateToProps,
  null
)(Event);
