import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import _ from 'lodash';

import { fetchActivityList, createUserActivity, editUserActivity, fetchTeamStandings, fetchEvent } from '../../actions';
import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';
import DatePickerInput from '../ui/DatePickerInput';
import DropdownInput from '../ui/DropdownInput';
import PageSpinner from '../ui/PageSpinner';

import * as utils from '../../utils';
import * as Constants from '../../Constants';

const headers = ['> Low Intensity Activities', '> Medium Intensity Activities', '> High Intensity Activities'];

const LogActivityForm = ({
  eventId,
  events,
  activities,
  initialValues,
  formType,
  isOpen,
  pristine,
  handleSubmit,
  toggle,
  refreshStandings
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const actions = [];

    if (!events[eventId]) {
      actions.push(utils.buildActionWithParam(fetchEvent, eventId));
    }

    if (activities.length === 0) {
      actions.push(utils.buildActionWithParam(fetchActivityList));
    }

    if (actions.length > 0) {
      setLoading(true);
      Promise.all(actions.map(action => action.action(action.param))).then(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [events, eventId, activities, dispatch]);

  const onSubmit = formValues => {
    const minutes = parseInt(formValues.activityHours) * 60 + parseInt(formValues.activityMinutes);
    formValues = { ...formValues, name: formValues.description, minutes };

    if (!submitting) {
      setSubmitting(true);

      const action = formType === Constants.FORM_TYPE.ADD ? createUserActivity : editUserActivity;

      dispatch(action(formValues.id, formValues)).then(() => {
        if (refreshStandings) {
          dispatch(fetchTeamStandings(eventId));
        }
        toggle();
      });
    }
  };

  const createActivityOptions = () => {
    const activityOptions = [];
    for (let i = 0; i < 3; i++) {
      activityOptions.push(...createActivityIntensitySection(i + 1));
    }
    return activityOptions;
  };

  const createActivityIntensitySection = (intensity) => {
    const activityOptions = [];
    activityOptions.push({ type: 'header', text: headers[intensity - 1] });
    activityOptions.push(
      ..._.orderBy(activities.filter(o => o.name.toLowerCase() !== 'other' && o.intensity === intensity), ['name']).map(
        o => ({
          type: 'item',
          text: o.name,
          description: o.description,
          value: o.id,
        })
      )
    );
    activityOptions.push(
      ...activities
        .filter(o => o.name.toLowerCase() === 'other' && o.intensity === intensity)
        .map(o => ({
          type: 'item',
          text: o.name,
          description: o.description,
          value: o.id,
        }))
    );
    return activityOptions;
  };

  const renderFields = () => {
    const selectedActivityType = activities.find(o => o.id === initialValues.activityId);
    const maxDate = moment.min(moment(), moment(events[eventId].endDate, 'YYYY-MM-DD')).toDate();
    const minDate = moment(events[eventId].startDate, 'YYYY-MM-DD').toDate();

    return (
      <React.Fragment>
        <Field
          name="activityId"
          component={DropdownInput}
          label="Activity Type"
          title={selectedActivityType ? selectedActivityType.description : 'Select an activity'}
          menuItems={createActivityOptions()}
        ></Field>

        <Field
          name="activityTimestamp"
          component={DatePickerInput}
          label="Activity Date"
          className="form-control"
          todayButton="Today"
          placeholderText="Enter activity date"
          maxDate={maxDate}
          minDate={minDate}
        />
        <Row>
          <Col xs="6">
            <Field name="activityHours" component={FormInput} type="input" label="Hours" placeholderText="Hours" />
          </Col>
          <Col xs="6">
            <Field
              name="activityMinutes"
              component={FormInput}
              type="input"
              label="Minutes"
              placeholderText="Minutes"
            />
          </Col>
        </Row>
        <Field
          name="description"
          component={FormInput}
          type="input"
          label="Short Description"
          placeholderText="Enter a short activity description"
        />
      </React.Fragment>
    );
  };

  return (
    <FormModal
      onSubmit={onSubmit}
      toggle={toggle}
      submitting={submitting}
      onInit={() => { }}
      {..._.pick({ isOpen, handleSubmit, pristine })}
      title={formType === Constants.FORM_TYPE.ADD ? 'Log Activity' : 'Edit Activity'}
    >
      {loading ? <PageSpinner /> : renderFields()}
    </FormModal>
  );
};

LogActivityForm.propTypes = {
  eventId: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const validate = (formValues, props) => {
  const errors = {};

  if (formValues.activityId <= 0) {
    errors.activityId = 'Activity type required';
  }

  const activityTimestamp = moment(formValues.activityTimestamp, 'YYYY-MM-DD');

  if (!formValues.activityTimestamp) {
    errors.activityTimestamp = 'Activity date required';
  } else if (!activityTimestamp.isValid()) {
    errors.activityTimestamp = 'Invalid date';
  } else if (activityTimestamp.toDate() > new Date()) {
    errors.activityTimestamp = 'Selected date is in the future';
  }

  const event = props.events[props.eventId];

  if (event) {
    const eventStartDate = moment(event.startDate, 'YYYY-MM-DD');
    const eventEndDate = moment(event.endDate, 'YYYY-MM-DD');

    if (activityTimestamp > eventEndDate) {
      errors.activityTimestamp = 'Selected date is after the event end date';
    } else if (activityTimestamp < eventStartDate) {
      errors.activityTimestamp = 'Selected date is before the event start date';
    }
  }

  if (isNaN(formValues.activityHours) || isNaN(formValues.activityMinutes)) {
    errors.activityHours = 'Enter a number';
  } else {
    const hours = parseInt(formValues.activityHours);
    const minutes = parseInt(formValues.activityMinutes);

    if (hours < 0 || minutes < 0) {
      errors.activityHours = 'Enter a positive number';
    }

    if (hours * 60 + minutes < 15) {
      errors.activityHours = 'Less than 15 minutes';
    }
  }

  const activityType = props.activities.find(o => o.id === formValues.activityId);

  if (activityType && activityType.name.toLowerCase() === 'other') {
    if (!formValues.description) {
      errors.description = 'Description required';
    }
  }

  return errors;
};

const form = reduxForm({ form: 'logActivityForm', enableReinitialize: true, validate })(LogActivityForm);

const mapStateToProps = state => ({
  activities: Object.values(state.activities),
  events: state.events,
});

const formConnect = connect(mapStateToProps, { fetchActivityList, createUserActivity, editUserActivity, fetchTeamStandings, fetchEvent })(form);

export default formConnect;
