import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import { createActivityType, editActivityType } from '../../actions';

import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';

import * as Constants from '../../Constants';

const EditActivityTypeForm = ({
  //Assign Values to isOpen and pristine directly as Default props will be removed in future JS.
  isOpen = false,
  pristine = false,
  handleSubmit,
  initialize,
  toggle,
  formType,
  initialValues,
  regions,
  createActivityType,
  editActivityType,
}) => {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    initialize(initialValues);
  }, [initialize, initialValues]);

  const onSubmit = (formValues) => {
    if (!submitting) {
      setSubmitting(true);
    }

    const action =
      formType === Constants.FORM_TYPE.ADD ? createActivityType(formValues) : editActivityType(formValues.id, formValues);
    action.finally(() => toggleModal());
  };

  const toggleModal = () => {
    setSubmitting(false);
    toggle();
  };

  const renderRegionOptions = () => {
    const regionOptions = Object.values(regions).map((region) => (
      <option value={region.id} key={region.id}>
        {region.name}
      </option>
    ));

    regionOptions.unshift(<option value={0} key={0} />);
    regionOptions.unshift(
      <option value={-1} key={-1}>
        Select a region
      </option>
    );

    return regionOptions;
  };

  const title = formType === Constants.FORM_TYPE.ADD ? 'Create Activity Type' : 'Edit Activity Type';

  return (
    <FormModal
      onSubmit={handleSubmit(onSubmit)}
      toggle={toggleModal}
      submitting={submitting}
      {..._.pick({ isOpen, pristine }, ['isOpen', 'pristine'])}
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
};

EditActivityTypeForm.propTypes = {
  isOpen: PropTypes.bool,
  pristine: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  formType: PropTypes.string.isRequired,
  initialValues: PropTypes.object.isRequired,
  regions: PropTypes.object.isRequired,
  createActivityType: PropTypes.func.isRequired,
  editActivityType: PropTypes.func.isRequired,
};

const validate = (formValues) => {
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

const formConnect = connect(null, { createActivityType, editActivityType })(form);

export default formConnect;
