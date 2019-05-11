import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { editEvent, createEvent } from '../../actions';
import _ from 'lodash';

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
        <Field name="name" component={FormInput} type="input" label="Name" />

        <Row>
          <Col>
            <Field
              name="startDate"
              component={DatePickerInput}
              label="Start Date"
              className="form-control"
              todayButton="Today"
            />
          </Col>
          <Col>
            <Field
              name="endDate"
              component={DatePickerInput}
              label="End Date"
              className="form-control"
              todayButton="Today"
            />
          </Col>
        </Row>

        <Field name="description" component={FormInput} type="textarea" label="Description" />
      </FormModal>
    );
  }
}

const mapStateToProps = state => {
  return {
    regions: state.regions,
  };
};

const editEventConnect = connect(
  mapStateToProps,
  { editEvent, createEvent }
)(EditEventForm);

const validate = formValues => {
  const errors = {};

  const startDate = new Date(formValues.startDate);
  const endDate = new Date(formValues.endDate);

  if (startDate > endDate) {
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

EditEventForm.propTypes = { regions: PropTypes.object.isRequired, formType: PropTypes.string.isRequired };

EditEventForm.defaultProps = { regions: {} };

export default reduxForm({ form: 'editEventForm', enableReinitialize: true, validate })(editEventConnect);
