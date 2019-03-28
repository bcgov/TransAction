import React from 'react';
import { Form, Input, Label, Button, ButtonGroup } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { createEvent } from '../actions';

class RenderBody extends React.Component {
  constructor(props) {
    super(props);

    this.state = { area: '', idFlag: props.children.id };
  }

  renderError({ error, touched }) {
    if (touched && error) {
      return <div className="errorMessage">{error}</div>;
    }
  }

  renderInput = ({ input, label, type, meta }) => {
    return (
      <div className="field">
        <Label>{label}</Label>
        <Input type={type} {...input} autoComplete="off" />
        {this.renderError(meta)}
      </div>
    );
  };

  handelClick() {
    this.dbCallBack();
    this.props.modelClose();
  }
  //form submition method
  onSubmit = formValues => {
    console.log(formValues);
    this.props.createEvent(formValues);
    this.handelClick(); //evoke methods to close model
  };

  parseId() {
    if (this.state.idFlag === 'add') {
      return (
        //take form into seperate function
        <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field name="name" component={this.renderInput} label="Name of Event" />
          <Field name="description" component={this.renderInput} label="Description of Event" type="textarea" />
          <ButtonGroup className="float-right mt-3">
            <Button color="primary">Do a thing!</Button>
            <Button color="secondary" onClick={this.props.modelClose}>
              Nooooooo
            </Button>
          </ButtonGroup>
        </Form>
      );
    } else {
      return <div>{this.props.children.body}</div>;
    }
  }

  dbCallBack() {
    alert('attempting to ' + this.state.idFlag + ' new event!');
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

const formWrapped = reduxForm({
  form: 'eventStuff',
  validate,
})(RenderBody);

export default connect(
  null,
  { createEvent }
)(formWrapped);
