import React from 'react';
import { Form, Input } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';

class RenderBody extends React.Component {
  constructor(props) {
    super(props);

    this.state = { area: '', idFlag: props.children.id };
  }

  parseId() {
    if (this.state.idFlag === 'add') {
      return (
        <Form onSubmit={this.onFormSubmit}>
          <Input type="textarea" name="text" />
        </Form>
      );
    } else {
      return <div>{this.props.children.body}</div>;
    }
  }

  render() {
    return <div>{this.parseId()}</div>;
  }
}

export default reduxForm({
  form: 'eventStuff',
})(RenderBody);
