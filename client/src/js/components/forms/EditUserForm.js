import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import { editUser } from '../../actions';
import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';

const EditUserForm = ({
  isOpen,
  pristine,
  handleSubmit,
  initialize,
  toggle,
  initialValues,
  regions,
  editUser,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const onInit = useCallback(() => {
    initialize(initialValues);
  }, [initialize, initialValues]);

  useEffect(() => {
    if (isOpen) {
      onInit();
    }
  }, [isOpen, onInit]);

  const onSubmit = (formValues) => {
    setSubmitting(true);
    editUser(formValues.id, formValues).finally(() => {
      setSubmitting(false);
      toggle();
    });
  };

  const renderRegionOptions = () => {
    return Object.values(regions).map((region) => (
      <option value={region.id} key={region.id}>
        {region.name}
      </option>
    ));
  };

  return (
    <FormModal
      onSubmit={onSubmit}
      toggle={toggle}
      submitting={submitting}
      onInit={onInit}
      {..._.pick({ isOpen, handleSubmit, pristine }, ['isOpen', 'handleSubmit', 'pristine'])}
      title="Edit Profile"
    >
      <Field name="regionId" component={FormInput} type="select" label="Region">
        {renderRegionOptions()}
      </Field>
      <Field
        name="description"
        component={FormInput}
        type="textarea"
        label="Description"
        placeholderText="Enter a short description about yourself"
      />
    </FormModal>
  );
};

const validate = (formValues) => {
  const errors = {};

  if (!formValues.description) {
    errors.description = 'Description required';
  }

  return errors;
};

const form = reduxForm({ form: 'editUserForm', enableReinitialize: true, validate })(EditUserForm);

const mapStateToProps = (state) => ({
  regions: state.regions,
});

const formConnect = connect(mapStateToProps, { editUser })(form);

export default formConnect;
