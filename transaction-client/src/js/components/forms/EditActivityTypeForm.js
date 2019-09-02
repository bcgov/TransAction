import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import { createActivityType, editActivityType } from '../../actions';

import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';

import * as Constants from '../../Constants';

class EditActivityTypeForm extends React.Component {
  state = { submitting: false };

  onInit = () => {
    this.props.initialize(this.props.initialValues);
  };

  onSubmit = formValues => {
    if (!this.state.submitting) {
      this.setState({ submitting: true });
    }

    if (this.props.formType === Constants.FORM_TYPE.ADD) {
      this.props.createActivityType(formValues).then(() => {
        this.toggleModal();
      });
    } else {
      this.props.editActivityType(formValues.id, formValues).then(() => {
        this.toggleModal();
      });
    }
  };

  toggleModal = () => {
    this.setState({ submitting: false });

    this.props.toggle();
  };

  renderRegionOptions() {
    const regionOptions = Object.values(this.props.regions).map(region => {
      return (
        <option value={region.id} key={region.id}>
          {region.name}
        </option>
      );
    });

    regionOptions.unshift(<option value={0} key={0} />);
    regionOptions.unshift(
      <option value={-1} key={-1}>
        Select a region
      </option>
    );

    return regionOptions;
  }

  render() {
    const title = this.props.formType === Constants.FORM_TYPE.ADD ? 'Create Activity Type' : 'Edit Activity Type';

    return (
      <FormModal
        onSubmit={this.onSubmit}
        toggle={this.toggleModal}
        submitting={this.state.submitting}
        onInit={this.onInit}
        {..._.pick(this.props, ['isOpen', 'handleSubmit', 'pristine'])}
        title={title}
      >
        <Field name="name" component={FormInput} type="text" label="Name" placeholderText="Enter activity type name" />
        <Field
          name="description"
          component={FormInput}
          type="text"
          label="Description"
          placeholderText="Enter activity type description"
        />
        <Field name="intensity" component={FormInput} type="select" label="Intensity">
          <option value={1}>Low Intensity</option>
          <option value={2}>Medium Intensity</option>
          <option value={3}>High Intensity</option>
        </Field>
      </FormModal>
    );
  }
}

EditActivityTypeForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

EditActivityTypeForm.defaultProps = { isOpen: false, pristine: false };

const validate = formValues => {
  const errors = {};

  if (!formValues.name) {
    errors.name = 'Name required';
  }

  if (!formValues.description) {
    errors.description = 'Description required';
  }

  return errors;
};

const form = reduxForm({ form: 'editActivityTypeForm', enableReinitialize: true, validate })(EditActivityTypeForm);

const formConnect = connect(
  null,
  { createActivityType, editActivityType }
)(form);

export default formConnect;
