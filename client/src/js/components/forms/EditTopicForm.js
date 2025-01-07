import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import { editTopic, createTopic, fetchTopicDetail } from '../../actions';
import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';

import * as Constants from '../../Constants';

const EditTopicForm = ({
  formType,
  isOpen,
  pristine,
  handleSubmit,
  initialize,
  toggle,
  initialValues,
  editTopic,
  createTopic,
  fetchTopicDetail,
  topic,
  currentUser,
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

    if (formType === Constants.FORM_TYPE.ADD) {
      const topicObj = { ...formValues, userId: currentUser.id };
      createTopic(topicObj).finally(() => setSubmitting(false));
    } else {
      const topicObj = { ...topic, title: formValues.title, body: formValues.body };
      Promise.all([editTopic(topicObj)]).then(() => {
        fetchTopicDetail(formValues.topicId);
        toggleModal();
      });
    }
  };

  const toggleModal = () => {
    setSubmitting(false);
    toggle();
  };

  const title = formType === Constants.FORM_TYPE.ADD ? 'Create New Thread' : 'Edit Thread';

  return (
    <FormModal
      onSubmit={onSubmit}
      toggle={toggleModal}
      submitting={submitting}
      onInit={onInit}
      {..._.pick({ isOpen, handleSubmit, pristine }, ['isOpen', 'handleSubmit', 'pristine'])}
      title={title}
    >
      <Field name="title" component={FormInput} type="input" label="Title" placeholderText="Enter the topic title" />
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
  if (!formValues.title) errors.title = 'A title is required';

  return errors;
};

const form = reduxForm({ form: 'editMessageForm', enableReinitialize: true, validate })(EditTopicForm);

const mapStateToProps = (state) => ({
  currentUser: state.users.all[state.users.current.id],
});

const formConnect = connect(mapStateToProps, { editTopic, createTopic, fetchTopicDetail })(form);

export default formConnect;
