import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { createEvent, fetchEvent, editEvent } from '../actions';
import EventForm from './EventForm';

class RenderBody extends React.Component {
  state = { area: '', idFlag: this.props.children.name };

  handelClick() {
    //this.dbCallBack();
    this.props.modalClose();
  }
  //form submition method
  onSubmit = formValues => {
    console.log(formValues, this.state.idFlag);
    if (this.state.idFlag === 'add') {
      this.props.createEvent(formValues);
    } else {
      this.props.editEvent(this.props.children.id, formValues);
    }
    this.handelClick(); //evoke methods to close model
  };
  //TODO REFACTOR
  parseId() {
    if (this.state.idFlag === 'add') {
      return (
        <div>
          <EventForm onSubmit={this.onSubmit} modalClose={this.props.modalClose} />
        </div>
      );
    } else {
      // console.log(this.props);
      //edit case
      return (
        <div>
          <EventForm
            onSubmit={this.onSubmit}
            idFlag={this.state.idFlag}
            initialValues={_.pick(this.props.event, 'name', 'description')}
            modalClose={this.props.modalClose}
          />
        </div>
      );
    }
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
)(RenderBody);
