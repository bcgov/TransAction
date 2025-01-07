import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import { createPost, editPost, fetchTopicDetail } from '../../actions';
import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';

import * as Constants from '../../Constants';

const EditMessageForm = ({
  formType,
  isOpen,
  pristine,
  handleSubmit,
  initialize,
  toggle,
  initialValues,
  createPost,
  editPost,
  fetchTopicDetail,
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
        ? createPost(formValues).then(() => fetchTopicDetail(formValues.topicId))
        : editPost(formValues).then(() => fetchTopicDetail(formValues.topicId));

    action.finally(() => toggleModal());
  };

  const toggleModal = () => {
    setSubmitting(false);
    toggle();
  };

  const title = formType === Constants.FORM_TYPE.ADD ? 'Reply to Topic' : 'Edit Reply';

  return (
    <FormModal
      onSubmit={onSubmit}
      toggle={toggleModal}
      submitting={submitting}
      onInit={onInit}
      {..._.pick({ isOpen, handleSubmit, pristine }, ['isOpen', 'handleSubmit', 'pristine'])}
      title={title}
    >
      <Field
        name="body"
        component={FormInput}
        type="textarea"
        label="Message Body"
        placeholderText="Enter the message body"
      />
    </FormModal>
  );
};

const validate = (formValues) => {
  const errors = {};
  if (!formValues.body) errors.body = 'A message is required';
  return errors;
};

const form = reduxForm({ form: 'editMessageForm', enableReinitialize: true, validate })(EditMessageForm);

const formConnect = connect(null, { createPost, editPost, fetchTopicDetail })(form);

export default formConnect;
