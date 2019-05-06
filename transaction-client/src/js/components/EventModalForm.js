import React from 'react';
import { Form, Input, Label, Button, FormGroup } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

class EventModalForm extends React.Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return <div className="errorMessage">{error}</div>;
    }
  }
  renderInput = ({ input, label, type, meta, divClass }) => {
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
        <Field name="name" component={this.renderInput} label="Name of Event" />
        <div className="modal-date-picker">
          <Field name="startDate" type="date" component={this.renderInput} label="Start Date" />
        </div>
        <div className="modal-date-picker">
          <Field name="endDate" type="date" component={this.renderInput} label="End Date" />
        </div>
        <Field name="description" component={this.renderInput} label="Description of Event" type="textarea" />
        <div className="float-right mt-3">
          <Button color="primary" className="mr-3">
            {this.props.name}
          </Button>
          <Button color="secondary" onClick={this.props.modalClose}>
            Cancel
          </Button>
        </div>
      </Form>
    );
  }

  dbCallBack() {
    alert('attempting to ' + this.props.idFlag + ' new event!');
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
  if (!formValues.startDate) {
    errors.startDate = 'You must enter a starting date';
  }
  if (!formValues.endDate) {
    errors.endDate = 'You must enter an ending date';
  }

  return errors;
};

export default reduxForm({
  form: 'eventmodalForm',
  validate,
})(EventModalForm);
