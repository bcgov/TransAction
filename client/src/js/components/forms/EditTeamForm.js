import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import { editTeam, createTeam, fetchCurrentUser } from '../../actions';

import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';

import * as Constants from '../../Constants';

const EditTeamForm = ({
  formType,
  isOpen,
  pristine,
  handleSubmit,
  initialize,
  toggle,
  initialValues,
  regions,
  createTeam,
  editTeam,
  fetchCurrentUser,
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

    const action =
      formType === Constants.FORM_TYPE.ADD
        ? createTeam(formValues).then(() => fetchCurrentUser())
        : editTeam(formValues.id, formValues).then(() => toggleModal());

    action.finally(() => setSubmitting(false));
  };

  const toggleModal = () => {
    setSubmitting(false);
    toggle();
  };

  const renderRegionOptions = () =>
    Object.values(regions).map((region) => (
      <option value={region.id} key={region.id}>
        {region.name}
      </option>
    ));

  const title = formType === Constants.FORM_TYPE.ADD ? 'Create Team' : 'Edit Team';

  return (
    <FormModal
      onSubmit={onSubmit}
      toggle={toggleModal}
      submitting={submitting}
      onInit={onInit}
      {..._.pick({ isOpen, handleSubmit, pristine }, ['isOpen', 'handleSubmit', 'pristine'])}
      title={title}
    >
      <Field name="name" component={FormInput} type="text" label="Name" placeholderText="Enter team name" />
      <Field name="regionId" component={FormInput} type="select" label="Region">
        {renderRegionOptions()}
      </Field>
      <Field
        name="description"
        component={FormInput}
        type="textarea"
        label="Description"
        placeholderText="Enter a short description about your team"
      />
      <Field
        name="goal"
        component={FormInput}
        type="text"
        label="Goal"
        placeholderText="Enter team point goal"
        tooltipText="The TransAction points goal for your team. Points are calculated using your team's workout
        intensity and duration. One minute of workout equals one point, and then multiplied by the workout
        intensity."
      />
    </FormModal>
  );
};

EditTeamForm.propTypes = {
  regions: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

EditTeamForm.defaultProps = {
  regions: {},
  isOpen: false,
  pristine: false,
};

const validate = (formValues) => {
  const errors = {};

  const goal = parseInt(formValues.goal, 10);

  if (!formValues.regionId || formValues.regionId <= 0) {
    errors.regionId = 'Region required';
  }

  if (!formValues.name) {
    errors.name = 'Name required';
  }

  if (!formValues.description) {
    errors.description = 'Description required';
  }

  if (!formValues.goal || isNaN(goal)) {
    errors.goal = 'Please enter a valid number';
  }

  if (goal >= 10000000) {
    errors.goal = 'Please set a smaller goal :)';
  }

  return errors;
};

const form = reduxForm({ form: 'editTeamForm', enableReinitialize: true, validate })(EditTeamForm);

const mapStateToProps = (state) => ({
  regions: state.regions,
  currentUser: state.users.all[state.users.current.id],
});

const formConnect = connect(mapStateToProps, { editTeam, createTeam, fetchCurrentUser })(form);

export default formConnect;
