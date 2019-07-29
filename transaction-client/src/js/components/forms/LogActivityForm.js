import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import _ from 'lodash';

import { fetchActivityList, createUserActivity, fetchTeamStandings } from '../../actions';
import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';
import DatePickerInput from '../ui/DatePickerInput';
import PageSpinner from '../ui/PageSpinner';

class LogActivityForm extends React.Component {
  state = { submitting: false, loading: false };

  onInit = () => {
    if (this.props.activities.length === 0) {
      this.setState({ loading: true });
      this.props.fetchActivityList().then(() => {
        this.props.initialize(this.props.initialValues);
        this.setState({ loading: false });
      });
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

  renderActivityOptions = () => {
    const activityOptions = this.props.activities.map(activity => {
      return (
        <option value={activity.id} key={activity.id}>
          {activity.name} - {activity.intensity}
        </option>
      );
    });

    activityOptions.unshift(<option value={0} key={0} />);
    activityOptions.unshift(
      <option value={-1} key={-1}>
        Select an activity
      </option>
    );

    return activityOptions;
  };

  renderFields = () => {
    return (
      <React.Fragment>
        <Field name="activityId" component={FormInput} type="select" label="Activity Type">
          {this.renderActivityOptions()}
        </Field>
        <Field
          name="activityTimestamp"
          component={DatePickerInput}
          label="Activity Date"
          className="form-control"
          todayButton="Today"
          placeholderText="Enter activity date"
          maxDate={new Date()}
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
  isOpen: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const validate = formValues => {
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
  };
};

const formConnect = connect(
  mapStateToProps,
  { fetchActivityList, createUserActivity, fetchTeamStandings }
)(form);

export default formConnect;
