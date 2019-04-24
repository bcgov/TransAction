import React, { Component } from 'react';
import { fetchUser, fetchEvent, fetchUserScore, fetchTeamScore } from '../actions';
import EventModal from './EventModal';
import LogActivityModalBody from './LogActivityModalBody';
import UserScoreGraphicCard from './UserScoreGraphicCard';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem, Container, Spinner, Button, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

class EventPage extends Component {
  state = { loading: true, modal: false };
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

  componentDidMount() {
    // this.toggleSpinner();
    this.props.fetchEvent(this.props.paramId).then(() => {
      Promise.all([
        this.props.fetchUser('me'),

        this.props.fetchUserScore(this.props.user.id, this.props.event.id),
        this.props.fetchTeamScore(this.props.user.teamId, this.props.event.id),
      ])
        .then(() => {
          this.toggleSpinner();
        })
        .catch(() => {
          this.toggleSpinner();
        });
    });
  }

  printScores() {
    return (
      <React.Fragment>
        <Row>
          <Col>
            <UserScoreGraphicCard
              userScore={this.props.userScore.value}
              teamScore={this.props.teamScore.value}
              type="event"
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  checkTeam() {
    if (this.props.user.teamId === null) {
      return (
        <React.Fragment>
          <h5> What is {this.props.event.name}?</h5>
          <div className="event_description mt-2 mb-2">{this.props.event.description}</div>
          <div id="centerText">
            <Link to="/getting_started" id={this.props.event.id} name={this.props.event.name}>
              <Button size="lg" color="primary">
                Get Started!
              </Button>
            </Link>
          </div>
        </React.Fragment>
      );
    } else {
      return this.printScores();
    }
    //TODO add else with graphical elements
  }

  renderPage() {
    return (
      <React.Fragment>
        <h1>{this.props.event.name} </h1>
        <Button className="float-right" color="primary" onClick={this.toggle}>
          Add Activity
        </Button>
        <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Log an Activity">
          <LogActivityModalBody modalClose={this.toggle} eventid={this.props.event.id} name="log" />
        </EventModal>
        <h3>Hi {this.props.user.fname}!</h3>
        {this.checkTeam()}
      </React.Fragment>
    );
  }

  decideRender() {
    if (this.state.loading) {
      //console.log('spin');
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    }
    //Loading DONE
    else {
      return <div>{this.renderPage()}</div>;
    }
  }

  render() {
    return (
      <Container>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Event</BreadcrumbItem>
        </Breadcrumb>
        {this.decideRender()}
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    paramId: parseInt(ownProps.match.params.id),
    event: state.events[parseInt(ownProps.match.params.id)],
    userScore: state.userScore,
    teamScore: state.teamScore,
  };
};

export default connect(
  mapStateToProps,
  { fetchUser, fetchEvent, fetchUserScore, fetchTeamScore }
)(EventPage);
