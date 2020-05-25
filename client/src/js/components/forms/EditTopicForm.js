import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import { editTopic, createTopic, fetchTopicDetail } from '../../actions';
import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';

import * as Constants from '../../Constants';

class EditTopicForm extends React.Component {
  state = { submitting: false };

  onInit = () => {
    this.props.initialize(this.props.initialValues);
  };

  onSubmit = formValues => {
    const { formType, editTopic, createTopic, fetchTopicDetail, topic, currentUser } = this.props;

    if (!this.state.submitting) {
      this.setState({ submitting: true });
    }

    if (formType === Constants.FORM_TYPE.ADD) {
      const topicObj = { ...formValues, userId: currentUser.id };
      createTopic(topicObj).then(() => {});
    } else {
      const topicObj = { ...topic, title: formValues.title, body: formValues.body };

      Promise.all([editTopic(topicObj)]).then(() => {
        fetchTopicDetail(formValues.topicId);
        this.toggleModal();
      });
    }
  };

  toggleModal = () => {
    this.setState({ submitting: false });

    this.props.toggle();
  };

  render() {
    const { formType } = this.props;
    const title = formType === Constants.FORM_TYPE.ADD ? 'Create New Thread' : 'Edit Thread';

    return (
      <FormModal
        onSubmit={this.onSubmit}
        toggle={this.toggleModal}
        submitting={this.state.submitting}
        onInit={this.onInit}
        {..._.pick(this.props, ['isOpen', 'handleSubmit', 'pristine'])}
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
  }
}
EditTopicForm.propTypes = {};

const validate = formValues => {
  const errors = {};

  if (!formValues.body) errors.body = 'A message is required';

  if (!formValues.title) errors.title = 'A title is required';

  return errors;
};

const form = reduxForm({ form: 'editMessageForm', enableReinitialize: true, validate })(EditTopicForm);

const mapStateToProp = state => {
  return {
    currentUser: state.users.all[state.users.current.id],
  };
};

const formConnect = connect(
  mapStateToProp,
  { editTopic, createTopic, fetchTopicDetail }
)(form);

export default formConnect;
