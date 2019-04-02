import React from 'react';
import { Form, Input, Label, Button, ButtonGroup } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

class EventForm extends React.Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return <div className="errorMessage">{error}</div>;
    }
  }
  //TODO This sucks ass please refactor
  renderInput = ({ input, label, type, meta, action }) => {
    if (action === 'add') {
      return (
        <div className="field">
          <Label>{label}</Label>
          <Input type={type} {...input} autoComplete="off" />
          {this.renderError(meta)}
        </div>
      );
    } else {
      return (
        <div className="field">
          <Label>{label}</Label>
          <Input type={type} {...input} autoComplete="off" />
          {this.renderError(meta)}
        </div>
      );
    }
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  //TODO should probably refactor the if else
  parseId() {
    if (this.props.idFlag === 'add') {
      return (
        //take form into seperate function
        <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field name="name" component={this.renderInput} label="Name of Event" action={this.props.idFlag} />
          <Field
            name="description"
            component={this.renderInput}
            label="Description of Event"
            type="textarea"
            action={this.props.idFlag}
          />
          <ButtonGroup className="float-right mt-3">
            <Button color="primary">Do a thing!</Button>
            <Button color="secondary" onClick={this.props.modalClose}>
              Nooooooo
            </Button>
          </ButtonGroup>
        </Form>
      );
    } else {
      //edit case
      return (
        <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field name="name" component={this.renderInput} label="Name of Event" action={this.props.idFlag} />
          <Field
            name="description"
            component={this.renderInput}
            label="Description of Event"
            type="textarea"
            action={this.props.idFlag}
          />
          <ButtonGroup className="float-right mt-3">
            <Button color="primary">Do a thing!</Button>
            <Button color="secondary" onClick={this.props.modalClose}>
              Nooooooo
            </Button>
          </ButtonGroup>
        </Form>
      );
    }
  }

  dbCallBack() {
    alert('attempting to ' + this.props.idFlag + ' new event!');
  }

  render() {
    return <div>{this.parseId()}</div>;
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
  form: 'stremForm',
  validate,
})(EventForm);
