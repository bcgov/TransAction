import React, { Component } from 'react';
import _ from 'lodash';
import { Breadcrumb, BreadcrumbItem, Container, Button } from 'reactstrap';
import Event from './Event';
import EventModal from './EventModal';
import { connect } from 'react-redux';
import { fetchEvents } from '../actions';
//import ArchivedEvent from './ArchivedEvent';

class Main extends Component {
  state = { modal: false };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  renderEventList() {
    const events = this.props.events.map(event => {
      return (
        <div className="mb-5" key={event.id}>
          <Event event={event} />
        </div>
      );
    });
    //console.log(events);
    return events;
  }

  componentDidMount() {
    this.props.fetchEvents();
  }

  render() {
    return (
      <Container>
        <div>
          <Breadcrumb>
            <BreadcrumbItem active>Home</BreadcrumbItem>
          </Breadcrumb>
          <Button color="primary" className="btn-sm px-3 mx-3 mb-4" onClick={this.toggle}>
            Add an Event
          </Button>
          <EventModal name="add" toggle={this.toggle} isOpen={this.state.modal} text="Add an Event" />
        </div>
        <div>{this.renderEventList()}</div>

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
  return { events: _.orderBy(Object.values(state.events), ['startDate'], ['desc']) };
};

export default connect(
  mapStateToProps,
  { fetchEvents }
)(Main);
