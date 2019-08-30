import React from 'react';
import { Field, reduxForm } from 'redux-form';

class EditAdminForm extends React.Component {
  onInit = () => {
    this.props.initialize(this.props.initialValues);
  };
  render() {
    <div>editAdminForum</div>;
  }
}

export default reduxForm({
  form: 'editAdminForm',
})(EditAdminForm);
