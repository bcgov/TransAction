import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { createEvent, fetchEvent, editEvent } from '../actions';
import EventModalForm from './EventModalForm';

class EventModalBody extends React.Component {
  state = { idFlag: this.props.name };

  handelClick() {
    //this.dbCallBack();
    this.props.modalClose();
  }
  //checks idFlag to add or edit
  onSubmit = formValues => {
    if (this.state.idFlag === 'add') {
      const eventObj = { ...formValues, concurrencyControlNumber: 1 };
      this.props.createEvent(eventObj);
    } else this.props.editEvent(this.props.id, formValues);

    this.handelClick(); //evoke methods to close model
  };

  parseId() {
    //if we are not adding a new event, populate initial values
    if (this.state.idFlag !== 'add')
      var initialValues = _.pick(this.props.event, 'name', 'description', 'startDate', 'endDate');
    return (
      <EventModalForm
        onSubmit={this.onSubmit}
        idFlag={this.state.idFlag}
        initialValues={initialValues}
        modalClose={this.props.modalClose}
        name={this.props.name}
      />
    );
  }

  dbCallBack() {
    alert('attempting to ' + this.state.idFlag + ' new event!');
  }

  render() {
    return <div>{this.parseId()}</div>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return { event: state.events[ownProps.id] };
};

export default connect(
  mapStateToProps,
  { createEvent, fetchEvent, editEvent }
)(EventModalBody);
