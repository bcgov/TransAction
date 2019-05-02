import React, { Component } from 'react';
import { fetchCurrentUser, fetchEvent, fetchUserScore, fetchTeamScore } from '../actions';
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
        this.props.fetchCurrentUser(),

        this.props.fetchUserScore(this.props.currentUser.id, this.props.event.id),
        this.props.fetchTeamScore(this.props.currentUser.teamId, this.props.event.id),
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
              userScore={this.props.userScore.score}
              teamScore={this.props.teamScore.score}
              type="event"
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  checkTeam() {
    if (this.props.currentUser.teamId === null) {
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
      return (
        <React.Fragment>
          <Button className="float-right" color="primary" onClick={this.toggle}>
            Add Activity
          </Button>
          <EventModal toggle={this.toggle} isOpen={this.state.modal} text="Log an Activity">
            <LogActivityModalBody modalClose={this.toggle} eventId={this.props.event.id} name="log" />
          </EventModal>
          {this.printScores()}
        </React.Fragment>
      );
    }
    //TODO add else with graphical elements
  }

  renderPage() {
    return (
      <React.Fragment>
        <h1>{this.props.event.name} </h1>

        <h3>Hi {this.props.currentUser.fname}!</h3>
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
    currentUser: state.currentUser,
    paramId: parseInt(ownProps.match.params.id),
    event: state.events[parseInt(ownProps.match.params.id)],
    userScore: state.userScore,
    teamScore: state.teamScore,
  };
};

export default connect(
  mapStateToProps,
  { fetchCurrentUser, fetchEvent, fetchUserScore, fetchTeamScore }
)(EventPage);
