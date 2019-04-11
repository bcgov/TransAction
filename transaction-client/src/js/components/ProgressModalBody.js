import React, { Component } from 'react';
import _ from 'lodash';
import ProgressModalForm from './ProgressModalForm';

class ProgressModalBody extends Component {
  onSubmit = formValues => {
    let obj = {};
    console.log(this.props.name);
    if (this.props.name === 'create') {
      obj = { goal: formValues, progressbar: true };
    } else {
      obj = { goal: formValues };
    }
    console.log(obj);

    this.props.onSubmit(obj);
    this.props.modalClose();
  };

  decideRender() {
    if (this.props.name === 'edit') {
      var initialValues = _.pick(this.props.team, 'goal');
      //console.log(initialValues);
    }
    return (
      <ProgressModalForm
        initialValues={initialValues}
        onSubmit={this.onSubmit}
        modalClose={this.props.modalClose}
        name={this.props.name}
        amt={this.props.team.progressamt}
      />
    );
  }

  render() {
    return <div>{this.decideRender()}</div>;
  }
}

export default ProgressModalBody;
