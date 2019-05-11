import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem, Button, Row, Col } from 'reactstrap';
import moment from 'moment';

import { fetchEvent, fetchUserEventScore, fetchTeamEventScore } from '../actions';
import EventModal from './EventModal';
import LogActivityModalBody from './LogActivityModalBody';
import UseScoreCard from './ui/UseScoreCard';
import PageSpinner from './ui/PageSpinner';

import * as Constants from '../Constants';

class EventDetail extends React.Component {
  state = { loading: true, modal: false };

  componentDidMount() {
    const eventId = this.props.match.params.id;

    Promise.all([
      this.props.fetchEvent(eventId),
      this.props.fetchUserEventScore(this.props.currentUser.id, eventId),
      this.props.fetchTeamEventScore(this.props.currentUser.teamId, eventId),
    ])
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {
        //this.setState({ loading: false });
      });
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  renderScores() {
    const currentUser = this.props.currentUser;
    const eventId = this.props.event.id;
    const score = this.props.scores.user[currentUser.id][eventId];
    const teamScore = this.props.scores.team[currentUser.teamId][eventId];
    return (
      <React.Fragment>
        <Row>
          <Col>
            <UseScoreCard
              score={score}
              teamScore={teamScore}
              event={this.props.event}
              cardWidth={Constants.USER_SCORE_CARD_WIDTH.WIDE}
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
          {/* {this.printScores()} */}
        </React.Fragment>
      );
    }
    //TODO add else with graphical elements
  }

  renderContent() {
    return (
      <React.Fragment>
        <h4>{this.props.event.name}</h4>
        <p className="text-muted">
          {moment(this.props.event.startDate).format('MMMM Do, YYYY')} to{' '}
          {moment(this.props.event.endDate).format('MMMM Do, YYYY')}
        </p>
        <p>{this.props.event.description}</p>
        {this.renderScores()}
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/event">Events</Link>
            </BreadcrumbItem>
            {!this.state.loading && <BreadcrumbItem active>{this.props.event.name}</BreadcrumbItem>}
          </Breadcrumb>
        </Row>
        {this.state.loading ? <PageSpinner /> : this.renderContent()}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.users.current,
    event: state.events[ownProps.match.params.id],
    scores: state.scores,
  };
};

export default connect(
  mapStateToProps,
  { fetchEvent, fetchUserEventScore, fetchTeamEventScore }
)(EventDetail);
