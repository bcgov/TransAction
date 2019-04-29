import React, { Component } from 'react';
import { FormGroup, Label, Input, Form, Button } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

class ProgressModelForm extends Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return <div className="errorMessage">{error}</div>;
    }
  }
  renderInput = ({ input, label, type, meta }) => {
    return (
      <React.Fragment>
        <FormGroup>
          <Label>{label}</Label>
          <Input type={type} {...input} autoComplete="off" />
          {this.renderError(meta)}
        </FormGroup>
      </React.Fragment>
    );
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues.goal);
  };

  render() {
    let word = '';
    if (this.props.name === 'create') word = 'Create';
    else {
      word = 'Edit';
    }
    return (
      <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Field name="goal" component={this.renderInput} label={word + ' the goal'} />
        <Button color="primary" className="mr-3">
          {word} Goal
        </Button>
        <Button color="secondary" onClick={this.props.modalClose}>
          Cancel
        </Button>
      </Form>
    );
  }
}

const validate = formValues => {
  const errors = {};
  if (isNaN(formValues.edit)) {
    errors.edit = 'You must enter a valid number';
    //console.log('checking number : ', isNaN(formValues.edit));
    //console.log('heres the input : ', formValues.edit);
  }

  return errors;
};

export default reduxForm({
  form: 'ProgressModalForm',
  validate,
})(ProgressModelForm);
