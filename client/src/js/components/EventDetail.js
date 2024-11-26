import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import moment from 'moment';

import { fetchEvent, /*fetchUserEventScore, fetchTeamEventScore*/ } from '../actions';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import PageSpinner from './ui/PageSpinner';
import EventTeamStandings from './fragments/EventTeamStandings';
import EventRegionStandings from './fragments/EventRegionStandings';
import EventScoresPanel from './fragments/EventScoresPanel';
import CardWrapper from './ui/CardWrapper';

import * as api from '../api/api';
import * as Constants from '../Constants';

const EventDetail = () => {
  const [loading, setLoading] = useState(true);
  const { id: eventId } = useParams();
  const dispatch = useDispatch();

  const event = useSelector((state) => state.events[eventId]);
  // const currentUser = useSelector((state) => state.users.all[state.users.current.id]);
  // const scores = useSelector((state) => state.scores);

  useEffect(() => {
    api.resetCancelTokenSource();
    dispatch(fetchEvent(eventId)).then(() => {
      setLoading(false);
    });

    return () => {
      api.cancelRequest();
    };
  }, [dispatch, eventId]);

  const renderContent = () => {
    if (!event) return <div />;

    return (
      <>
        <CardWrapper>
          <h4>{event.name}</h4>
          <p className="text-muted">
            {moment(event.startDate).format('MMMM Do')} to{' '}
            {moment(event.endDate).format('MMMM Do')}
          </p>
          <Markdown children={event.description} allowedElements={Constants.MARKDOWN.ALLOWED} />
          <EventScoresPanel event={event} />
        </CardWrapper>
        <CardWrapper>
          <EventRegionStandings eventId={event.id} />
        </CardWrapper>
        <CardWrapper>
          <EventTeamStandings eventId={event.id} />
        </CardWrapper>
      </>
    );
  };

  const breadCrumbItems = [{ active: false, text: 'Events', link: Constants.PATHS.EVENT }];
  if (event) breadCrumbItems.push({ active: true, text: event.name });

  return (
    <>
      <BreadcrumbFragment>{breadCrumbItems}</BreadcrumbFragment>
      {loading ? <PageSpinner /> : renderContent()}
    </>
  );
};

export default EventDetail;
