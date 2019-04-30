import React from 'react';
import { Form, Input, Label, Button, FormGroup } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

class LogActivityModalForm extends React.Component {
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
  renderDropdown = () => {
    const options = this.props.activityList.map(activity => (
      <option key={activity.id} value={activity.id}>
        {activity.name}
        {'-'}
        {activity.intensity}
      </option>
    ));
    return options;
  };

  onSubmit = formValues => {
    const activityObj = { ...formValues };
    this.props.onSubmit(activityObj);
  };

  renderForms() {
    return (
      <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Field name="activityId" component="select" className="form-control">
          {this.renderDropdown()}
        </Field>
        <div id="log-time">
          <Field name="hours" component={this.renderInput} label="How Many Hours?" />
        </div>
        <div id="log-time">
          <Field name="minutes" component={this.renderInput} label="How Many Minutes?" />
        </div>
        <div className="float-right mt-3">
          <Button color="primary" className="mr-3">
            Add
          </Button>
          <Button color="secondary" onClick={this.props.modalClose}>
            Cancel
          </Button>
        </div>
      </Form>
    );
  }
  render() {
    return this.renderForms();
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.hours) {
    errors.name = 'Please Enter a value ';
  }

  return errors;
};

export default reduxForm({
  form: 'CreateTeammodalForm',
  validate,
})(LogActivityModalForm);
