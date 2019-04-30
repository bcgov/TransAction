import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Container, Col, Row, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import EventModal from './EventModal';
import CreateTeamModalBody from './CreateTeamModalBody';

class GettingStarted extends Component {
  state = { modal: false };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  renderText() {
    return (
      <Container>
        <h1>Getting Started</h1>
        <div className="mb-4">
          You participate in TransAction by becoming a member of a team. A team is composed of a "Team Leader" and up to
          four "Team Members". You can join a team of people you know, or make yourself available to join any team in
          the ministry.
        </div>
        <div id="centerText">
          <h1>Whats The Difference?</h1>
          <Row>
            <Col xs="6" id="borderRoleDifferences">
              <h3 className="mt-4">Team Leader</h3>
              <div>Recruit and Unleash Teamates and their Potential!</div>
              <ul className="text-left">
                <br />
                <li>Manage your Team and create a name!</li>
                <br />
                <li>Decide who will join your team, or reject those unworthy.</li>
                <br />
                <li>Contact free agents personally so you can claim those with the highest potential!</li>
                <br />
                <li>Create a unique team profile.</li>
                <br />
                <li>Go Crazy!</li>
              </ul>
              <Button size="lg" color="primary" className="mb-4" onClick={this.toggle}>
                Create Team
              </Button>
              <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Create a Team!">
                <CreateTeamModalBody modalClose={this.toggle} name="create" />
              </EventModal>
            </Col>
            <Col xs="6" id="borderRoleDifferences">
              <h3 className="mt-4">Team Member</h3>
              <div>The Only Reason Team Leaders Have a Job.</div>
              <ul className="text-left">
                <br />
                <li>The powerhouses of the Team.</li>
                <br />
                <li>Decide to squad up with people you know, or float as a free agent! </li>
                <br />
                <li>Free agents may be picked up by any Team Leader in the Ministry.</li>
                <br />
                <li>Hone your skills to help your Team!</li>
                <br />
                <li>Win at all costs.</li>
              </ul>
              <Link to="/teamslist">
                <Button size="lg" color="primary" className="mb-4">
                  Join Team
                </Button>
              </Link>
            </Col>
          </Row>
        </div>
        <div className="mt-4">
          <h4 id="centerText">How Does it Work?</h4>
          Teams enter daily activity time in TransAction, and you monitor your team's progress and standings on the
          homepage. You will not only compete against other teams, but your individual time will also help your
          geographic area compete in the 4-way battle between regions and headquarters. toggleAgent={
            this.toggleAgent
          }{' '}
          isOpen={this.state.modalAgent}
          <br /> Exercise time is entered for each day and points are assigned based on level of intensity. Time entered
          is converted to points. High, medium and low intensity exercises are multiplied by factors of 3, 2, and 1,
          respectively. You can view your activity log entries on the calendar. More information can be found in the FAQ
          section of this webpage.
          <br />
          <br /> To begin: decide in your head whether you want to be a team leader or a regular team member and then
          click the Register Button!
          <br />
          <br />
          <br />
          <br />
        </div>
      </Container>
    );
  }

  render() {
    return (
      <Container>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
            <Link to={`/event/${this.props.id}`}>{this.props.name}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Getting Started</BreadcrumbItem>
        </Breadcrumb>
        {this.renderText()}
      </Container>
    );
  }
}

export default GettingStarted;
