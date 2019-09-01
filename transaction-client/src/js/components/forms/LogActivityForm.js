import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import _ from 'lodash';

import { fetchActivityList, createUserActivity, fetchTeamStandings, fetchEvent } from '../../actions';
import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';
import DatePickerInput from '../ui/DatePickerInput';
import DropdownInput from '../ui/DropdownInput';
import PageSpinner from '../ui/PageSpinner';

import * as utils from '../../utils';

const headers = ['> Low Intensity Activities', '> Medium Intensity Activities', '> High Intensity Activities'];

class LogActivityForm extends React.Component {
  state = { submitting: false, loading: true };

  componentDidMount() {}

  onInit = () => {
    const { events, eventId, fetchEvent, activities, fetchActivityList, initialize, initialValues } = this.props;

    const actions = [];

    if (!events[eventId]) {
      actions.push(utils.buildActionWithParam(fetchEvent, eventId));
    }

    if (activities.length === 0) {
      actions.push(utils.buildActionWithParam(fetchActivityList));
    }

    if (actions.length > 0) {
      this.setState({ loading: true });
      Promise.all(actions.map(action => action.action(action.param))).then(() => {
        initialize(initialValues);
        this.setState({ loading: false });
      });
    } else {
      this.setState({ loading: false });
    }
  };

  onSubmit = formValues => {
    const minutes = parseInt(formValues.activityHours) * 60 + parseInt(formValues.activityMinutes);
    formValues = { ...formValues, name: formValues.description, minutes };

    if (!this.state.submitting) {
      this.setState({ submitting: true });

      this.props.createUserActivity(formValues).then(() => {
        if (this.props.refreshStandings) {
          this.props.fetchTeamStandings(this.props.eventId);
        }

        this.toggleModal();
      });
    }
  };

  toggleModal = () => {
    this.setState({ submitting: false });

    this.props.toggle();
  };

  createActivityOptions = () => {
    const activityOptions = [];

    let i;
    for (i = 0; i < 3; i++) {
      activityOptions.push(...this.createActivityIntensitySection(i + 1));
    }

    return activityOptions;
  };

  createActivityIntensitySection(intensity) {
    const { activities } = this.props;
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
  }

  renderFields = () => {
    const { eventId, events } = this.props;

    const maxDate = moment.min(moment(), moment(events[eventId].endDate, 'YYYY-MM-DD')).toDate();
    const minDate = moment(events[eventId].startDate, 'YYYY-MM-DD').toDate();
    return (
      <React.Fragment>
        <Field
          name="activityId"
          component={DropdownInput}
          label="Activity Type"
          title="Select an activity"
          menuItems={this.createActivityOptions()}
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

  render() {
    return (
      <FormModal
        onSubmit={this.onSubmit}
        toggle={this.toggleModal}
        submitting={this.state.submitting}
        onInit={this.onInit}
        {..._.pick(this.props, ['isOpen', 'handleSubmit', 'pristine'])}
        title="Log Activity"
      >
        {this.state.loading ? <PageSpinner /> : this.renderFields()}
      </FormModal>
    );
  }
}

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

  if (!formValues.description) {
    errors.description = 'Description required';
  }

  return errors;
};

const form = reduxForm({ form: 'logActivityForm', enableReinitialize: true, validate })(LogActivityForm);

const mapStateToProps = (state, ownProps) => {
  const currentUser = state.users.all[state.users.current.id];
  return {
    activities: Object.values(state.activities),
    initialValues: {
      eventId: ownProps.eventId,
      userId: currentUser.id,
      teamId: currentUser.teamId,
      activityHours: 0,
      activityMinutes: 0,
      activityId: -1,
    },
    events: state.events,
  };
};

const formConnect = connect(
  mapStateToProps,
  { fetchActivityList, createUserActivity, fetchTeamStandings, fetchEvent }
)(form);

export default formConnect;
