import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Container, Button } from 'reactstrap';
import axios from 'axios';
import Event from './Event';
//import ArchivedEvent from './ArchivedEvent';

class Main extends Component {
  state = { events: [] };

  componentDidMount() {
    axios.get('http://localhost:3001/events', {}).then(response => {
      //console.log(response.data);
      this.setState({ events: response.data });
    });
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
          <Button className="mb-2 btn-sm px-3 mx-3 mb-4">Add New Event</Button>
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
