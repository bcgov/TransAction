import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { BreadcrumbItem, Row, Col, Alert } from 'reactstrap';
import moment from 'moment';

import { fetchEvent, fetchUserEventScore, fetchTeamEventScore } from '../actions';
import UserScoreCard from './fragments/UserScoreCard';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import PageSpinner from './ui/PageSpinner';
import LogActivityForm from './forms/LogActivityForm';

import * as Constants from '../Constants';

class EventDetail extends React.Component {
  state = { loading: true, showLogActivityForm: false };

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

  showLogActivityForm = () => {
    this.setState({ showLogActivityForm: true });
  };

  toggleLogActivityForm = () => {
    this.setState(prevState => ({
      showLogActivityForm: !prevState.showLogActivityForm,
    }));
  };

  renderScores() {
    const currentUser = this.props.currentUser;
    const eventId = this.props.event.id;
    const score = this.props.scores.user[currentUser.id][eventId];
    const teamScore = this.props.scores.team[currentUser.teamId][eventId];
    return (
      <Row className="my-5">
        <Col>
          <UserScoreCard
            score={score}
            teamScore={teamScore}
            event={this.props.event}
            cardWidth={Constants.USER_SCORE_CARD_WIDTH.WIDE}
            showLogActivityForm={this.showLogActivityForm}
          />
        </Col>
      </Row>
    );
  }

  renderContent() {
    if (!this.props.event) return <div />;

    return (
      <React.Fragment>
        <h4>{this.props.event.name}</h4>
        <p className="text-muted">
          {moment(this.props.event.startDate).format('MMMM Do, YYYY')} to{' '}
          {moment(this.props.event.endDate).format('MMMM Do, YYYY')}
        </p>
        <p>{this.props.event.description}</p>
        {this.props.currentUser.teamId ? (
          this.renderScores()
        ) : (
          <Row className="mb-5">
            <Col>
              <Alert color="warning">
                You are not currently not on a team. Click <Link to={Constants.PATHS.START}>HERE</Link> to get started!
              </Alert>
            </Col>
          </Row>
        )}
        <LogActivityForm
          isOpen={this.state.showLogActivityForm}
          toggle={this.toggleLogActivityForm}
          eventId={this.props.event.id}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment>
          <BreadcrumbItem>
            <Link to="/event">Events</Link>
          </BreadcrumbItem>
          {!this.state.loading && this.props.event && <BreadcrumbItem active>{this.props.event.name}</BreadcrumbItem>}
        </BreadcrumbFragment>
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
