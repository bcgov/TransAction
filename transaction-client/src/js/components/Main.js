import React, { Component } from 'react';
import _ from 'lodash';
import { Breadcrumb, BreadcrumbItem, Container, Button, Spinner, Row } from 'reactstrap';
import { connect } from 'react-redux';
import Event from './Event';
import EventModal from './EventModal';
import EventModalBody from './EventModalBody';
import { fetchEvents, fetchRoles, fetchCurrentUser, fetchCurrentRole } from '../actions';

//import ArchivedEvent from './ArchivedEvent';

class Main extends Component {
  state = { modal: false, loading: true };

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

  renderEventList() {
    const events = this.props.events.map(event => (
      <div key={event.id} className="mb-5">
        <Event event={event} />
      </div>
    ));

    //console.log(events);
    return events;
  }
  decideRender() {
    //console.log(this.state.isSpin);
    if (this.state.isSpin === true) {
      //console.log('spin');
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    } else {
      return this.renderEventList();
    }
  }

  componentDidMount() {
    Promise.all([this.props.fetchRoles(), this.props.fetchCurrentUser(), this.props.fetchEvents()])
      .then(() => {
        this.props.fetchCurrentRole(this.props.currentUser.roleId);
        this.toggleSpinner();
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

  checkAdmin() {
    if (this.props.currentRole.name === 'Admin') {
      return (
        <React.Fragment>
          <Button color="primary" className="btn-sm px-3 mb-4" onClick={this.toggle}>
            Add an Event
          </Button>
          <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Add an Event">
            <EventModalBody modalClose={this.toggle} name="add" />
          </EventModal>
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <Container>
        <Row>
          <Breadcrumb>
            <BreadcrumbItem active>Home</BreadcrumbItem>
          </Breadcrumb>
        </Row>
        {this.checkAdmin()}
        <div>{this.decideRender()}</div>

        {/*Old Event Buttons*/}
        {/*<div className = "col-sm offset-1">
            <ButtonGroup className = "row">
              <div className = "px-2">
                <ArchivedEvent name = "oldEvent1"></ArchivedEvent>
              </div>
              <div className = "px-2">
                <ArchivedEvent name = "oldEvent2"></ArchivedEvent>
              </div>
              <div className = "px-2">
                <ArchivedEvent name = "oldEvent3"></ArchivedEvent>
              </div>
              <div className = "px-2">
                <ArchivedEvent name = "oldEvent4"></ArchivedEvent>
              </div>
            </ButtonGroup>
          </div>*/}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  //sorts by start date

  return {
    events: _.orderBy(Object.values(state.events), ['startDate'], ['desc']),
    roles: state.roles,
    currentUser: state.currentUser,
    currentRole: state.currentRole,
  };
};

export default connect(
  mapStateToProps,
  { fetchEvents, fetchRoles, fetchCurrentUser, fetchCurrentRole }
)(Main);
