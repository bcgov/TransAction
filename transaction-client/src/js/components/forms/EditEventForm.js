import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import _ from 'lodash';

import { editEvent, createEvent } from '../../actions';
import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';
import DatePickerInput from '../ui/DatePickerInput';

import * as Constants from '../../Constants';

class EditEventForm extends React.Component {
  state = { submitting: false };

  onInit = () => {
    this.props.initialize(this.props.initialValues);
  };

  onSubmit = formValues => {
    if (!this.state.submitting) {
      this.setState({ submitting: true });
    }

    if (this.props.formType === Constants.FORM_TYPE.ADD) {
      this.props.createEvent(formValues).then(() => {
        this.toggleModal();
      });
    } else {
      this.props.editEvent(formValues.id, formValues).then(() => {
        this.toggleModal();
      });
    }
  };

  toggleModal = () => {
    this.setState({ submitting: false });

    this.props.toggle();
  };

  render() {
    const title = this.props.formType === Constants.FORM_TYPE.ADD ? 'Add Event' : 'Edit Event';

    return (
      <FormModal
        onSubmit={this.onSubmit}
        toggle={this.toggleModal}
        submitting={this.state.submitting}
        onInit={this.onInit}
        {..._.pick(this.props, ['isOpen', 'handleSubmit', 'pristine'])}
        title={title}
      >
        <Field name="name" component={FormInput} type="input" label="Name" placeholderText="Enter the event name" />

        <Row>
          <Col>
            <Field
              name="startDate"
              component={DatePickerInput}
              label="Start Date"
              className="form-control"
              todayButton="Today"
              placeholderText="Start date"
            />
          </Col>
          <Col>
            <Field
              name="endDate"
              component={DatePickerInput}
              label="End Date"
              className="form-control"
              todayButton="Today"
              placeholderText="End date"
            />
          </Col>
        </Row>

        <Field
          name="description"
          component={FormInput}
          type="textarea"
          label="Description"
          placeholderText="Enter the event description"
        />
      </FormModal>
    );
  }
}
EditEventForm.propTypes = {
  formType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const validate = formValues => {
  const errors = {};

  if (!formValues.startDate) {
    errors.startDate = 'Start date required';
  }
  if (!formValues.endDate) {
    errors.endDate = 'End date required';
  }

  const startDate = moment(formValues.startDate, 'YYYY-MM-DD');
  const endDate = moment(formValues.endDate, 'YYYY-MM-DD');

  if (isNaN(startDate)) {
    errors.startDate = 'Invalid start date';
  } else if (isNaN(endDate)) {
    errors.endDate = 'Invalid end date';
  } else if (startDate.isAfter(endDate)) {
    errors.startDate = 'Invalid start and end dates';
  }

  if (!formValues.name) {
    errors.name = 'Name required';
  }

  if (!formValues.description) {
    errors.description = 'Description required';
  }

  return errors;
};

const form = reduxForm({ form: 'editEventForm', enableReinitialize: true, validate })(EditEventForm);

const formConnect = connect(
  null,
  { editEvent, createEvent }
)(form);

export default formConnect;
