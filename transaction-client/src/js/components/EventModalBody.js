import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { createEvent, fetchEvent, editEvent } from '../actions';
import EventModalForm from './EventModalForm';

class EventModalBody extends React.Component {
  state = { idFlag: this.props.children.name };

  handelClick() {
    //this.dbCallBack();
    this.props.modalClose();
  }
  //checks idFlag to add or edit
  onSubmit = formValues => {
    console.log(formValues, this.state.idFlag);
    if (this.state.idFlag === 'add') this.props.createEvent(formValues);
    else this.props.editEvent(this.props.children.id, formValues);

    this.handelClick(); //evoke methods to close model
  };

  parseId() {
    //if we are not adding a new event, populate initial values
    if (this.state.idFlag !== 'add')
      var initialValues = _.pick(this.props.event, 'name', 'description', 'startDate', 'endDate');
    return (
      <div>
        <EventModalForm
          onSubmit={this.onSubmit}
          idFlag={this.state.idFlag}
          initialValues={initialValues}
          modalClose={this.props.modalClose}
        />
      </div>
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
  //console.log(state.events);
  //console.log(ownProps.children.id);
  return { event: state.events[ownProps.children.id] };
};

export default connect(
  mapStateToProps,
  { createEvent, fetchEvent, editEvent }
)(EventModalBody);
