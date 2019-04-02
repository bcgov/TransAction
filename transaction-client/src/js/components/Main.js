import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Container } from 'reactstrap';
import Event from './Event';
import tempDb from '../api/api';
import ModalEvent from './ModalEvent';
//import ArchivedEvent from './ArchivedEvent';

class Main extends Component {
  state = { events: [] };

  async componentDidMount() {
    const response = await tempDb.get('/events');
    //console.log(response.data);
    this.setState({ events: response.data });
  }

  renderEventList() {
    const events = this.state.events.map(event => {
      return (
        <div className="mb-5" key={event.id}>
          <Event event={event} />
        </div>
      );
    });
    return events;
  }

  render() {
    return (
      <Container>
        <div>
          <Breadcrumb>
            <BreadcrumbItem active>Home</BreadcrumbItem>
          </Breadcrumb>
          <ModalEvent id="add" color="primary" className="btn-sm px-3 mx-3 mb-4" name="Add New Event" />
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

export default Main;
