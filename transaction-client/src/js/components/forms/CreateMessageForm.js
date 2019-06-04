import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import { editEvent, createEvent, createPost, fetchTopicDetail } from '../../actions';
import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';

// import * as Constants from '../../Constants';

class EditMessageForm extends React.Component {
  state = { submitting: false };

  onInit = () => {
    this.props.initialize(this.props.initialValues);
  };

  onSubmit = formValues => {
    if (!this.state.submitting) {
      this.setState({ submitting: true });
    }

    this.props.createPost(formValues.topicId, formValues).then(() => {
      this.props.fetchTopicDetail(formValues.topicId);
      this.toggleModal();
    });
  };

  toggleModal = () => {
    this.setState({ submitting: false });

    this.props.toggle();
  };

  render() {
    return (
      <FormModal
        onSubmit={this.onSubmit}
        toggle={this.toggleModal}
        submitting={this.state.submitting}
        onInit={this.onInit}
        {..._.pick(this.props, ['isOpen', 'handleSubmit', 'pristine'])}
        title="Reply to Topic"
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
  }
}
EditMessageForm.propTypes = {};

const validate = formValues => {
  const errors = {};

  if (!formValues.body) errors.body = 'A message is required';

  return errors;
};

const form = reduxForm({ form: 'editMessageForm', enableReinitialize: true, validate })(EditMessageForm);

const formConnect = connect(
  null,
  { editEvent, createEvent, createPost, fetchTopicDetail }
)(form);

export default formConnect;
