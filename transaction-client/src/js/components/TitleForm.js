import React, { Component } from 'react';
import { Form, Input, Button, Row, Container } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

class TitleForm extends Component {
  renderInput = ({ input, type }) => {
    return <Input className="col-4 mr-2" type={type} {...input} autoComplete="off" />;
  };

  componentDidMount() {
    this.props.initialize(this.props.initialValues);
  }

  onSubmit = formValues => {
    //console.log('Attempting to edit description!');
    //console.log(formValues);
    this.props.onSubmit(formValues);
  };
  render() {
    return (
      <Container>
        <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Row>
            <h3 className="mr-2">{this.props.title}</h3>
            <Field name="name" component={this.renderInput} />
            <Button color="primary">Save Changes</Button>
          </Row>
        </Form>
      </Container>
    );
  }
}

export default reduxForm({
  form: 'titleForm',
  enableReinitialize: true,
})(TitleForm);
