import React, { Component } from 'react';
import { Form, Input, Button } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

class ProfileDescriptionForm extends Component {
  renderInput = ({ input, type }) => {
    return <Input type={type} {...input} autoComplete="off" />;
  };

  onSubmit = formValues => {
    console.log('Attempting to edit user description!');
    console.log(formValues);
    this.props.onSubmit(formValues);
  };
  render() {
    return (
      <div>
        <h3>Description</h3>
        <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field name="description" component={this.renderInput} type="textarea" />
          <Button color="primary">Save Changes</Button>
        </Form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'profileDescriptionForm',
})(ProfileDescriptionForm);
