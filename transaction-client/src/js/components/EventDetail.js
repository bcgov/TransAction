import React from 'react';
import { connect } from 'react-redux';
import Markdown from 'react-markdown';
import moment from 'moment';

import { fetchEvent, fetchUserEventScore, fetchTeamEventScore } from '../actions';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import PageSpinner from './ui/PageSpinner';
import EventTeamStandings from './fragments/EventTeamStandings';
import EventRegionStandings from './fragments/EventRegionStandings';
import EventScoresPanel from './fragments/EventScoresPanel';
import CardWrapper from './ui/CardWrapper';

import * as Constants from '../Constants';

class EventDetail extends React.Component {
  state = { loading: true };

  componentDidMount() {
    const eventId = this.props.match.params.id;

    this.props
      .fetchEvent(eventId)
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {
        //this.setState({ loading: false });
      });
  }

  renderContent() {
    if (!this.props.event) return <div />;

    return (
      <React.Fragment>
        <CardWrapper>
          <h4>{this.props.event.name}</h4>
          <p className="text-muted">
            {moment(this.props.event.startDate).format('MMMM Do, YYYY')} to{' '}
            {moment(this.props.event.endDate).format('MMMM Do, YYYY')}
          </p>
          <Markdown source={this.props.event.description} allowedTypes={Constants.MARKDOWN.ALLOWED} />
          <EventScoresPanel event={this.props.event} />
        </CardWrapper>
        <CardWrapper>
          <EventRegionStandings eventId={this.props.event.id} />
        </CardWrapper>
        <CardWrapper>
          <EventTeamStandings eventId={this.props.event.id} />
        </CardWrapper>
      </React.Fragment>
    );
  }

  render() {
    const breadCrumbItems = [{ active: false, text: 'Events', link: Constants.PATHS.EVENT }];
    if (this.props.event) breadCrumbItems.push({ active: true, text: this.props.event.name });

    return (
      <React.Fragment>
        <BreadcrumbFragment>{breadCrumbItems}</BreadcrumbFragment>
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
