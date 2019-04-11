import React from 'react';
import { Form, Input, Label, Button, FormGroup } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

class CreateTeamModalForm extends React.Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return <div className="errorMessage">{error}</div>;
    }
  }
  renderInput = ({ input, label, type, meta }) => {
    return (
      <FormGroup>
        <Label>{label}</Label>
        <Input type={type} {...input} autoComplete="off" />
        {this.renderError(meta)}
      </FormGroup>
    );
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  renderForms() {
    return (
      <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Field name="name" component={this.renderInput} label="Name of CreateTeam" />
        <Field name="description" component={this.renderInput} label="Description of CreateTeam" type="textarea" />
        <Field name="goal" component={this.renderInput} label="Set a Team Goal">
          {' '}
          Points.
        </Field>
        <div className="float-right mt-3">
          <Button color="primary" className="mr-3">
            Create Team!
          </Button>
          <Button color="secondary" onClick={this.props.modalClose}>
            Cancel
          </Button>
        </div>
      </Form>
    );
  }

  dbCallBack() {
    alert('attempting to ' + this.props.idFlag + ' new CreateTeam!');
  }

  render() {
    return this.renderForms();
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.name) {
    errors.name = 'You must enter a title';
  }
  if (!formValues.description) {
    errors.description = 'You must enter a description';
  }

  return errors;
};

export default reduxForm({
  form: 'CreateTeammodalForm',
  validate,
})(CreateTeamModalForm);
