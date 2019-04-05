import React from 'react';
import { Form, Input, Label, Button, ButtonGroup } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

class EventModalForm extends React.Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return <div className="errorMessage">{error}</div>;
    }
  }
  renderInput = ({ input, label, type, meta, divClass }) => {
    console.log(divClass);
    return (
      <div className={divClass}>
        <Label>{label}</Label>
        <Input type={type} {...input} autoComplete="off" />
        {this.renderError(meta)}
      </div>
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
          <Field
            name="startDate"
            type="date"
            placeholder=" date placeholder"
            component={this.renderInput}
            label="Start Date"
          />
        </div>
        <div className="modal-date-picker">
          <Field
            name="endDate"
            type="date"
            placeholder=" date placeholder"
            component={this.renderInput}
            label="End Date"
          />
        </div>
        <Field name="description" component={this.renderInput} label="Description of Event" type="textarea" />
        <ButtonGroup className="float-right mt-3">
          <Button color="primary">Save Edits</Button>
          <Button color="secondary" onClick={this.props.modalClose}>
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    );
  }

  dbCallBack() {
    alert('attempting to ' + this.props.idFlag + ' new event!');
  }

  render() {
    return <div>{this.renderForms()}</div>;
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
