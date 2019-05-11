import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { editEvent, createEvent } from '../../actions';

import FormModal from '../ui/FormModal';
import FormField from '../ui/FormField';
import DatePickerField from '../ui/DatePickerField';

import * as Constants from '../../Constants';

class EditEventForm extends React.Component {
  state = { submitting: false };

  onSubmit = formValues => {
    if (!this.state.submitting) {
      this.setState({ submitting: true });
    }

    if (this.props.formType === Constants.FORM_TYPE.ADD) {
      this.props.createEvent(formValues).then(() => {
        this.toggleModal();
      });
    } else {
      this.props.editEvent(formValues.id, formValues).then(() => {
        this.toggleModal();
      });
    }
  };

  toggleModal = () => {
    this.setState({ submitting: false });

    this.props.toggle();
  };

  render() {
    const { isOpen, handleSubmit, formType, change } = this.props;
    const title = formType === Constants.FORM_TYPE.ADD ? 'Add Event' : 'Edit Event';

    return (
      <FormModal
        handleSubmit={handleSubmit}
        onSubmit={this.onSubmit}
        isOpen={isOpen}
        toggle={this.toggleModal}
        submitting={this.state.submitting}
        title={title}
      >
        <Field name="name" component={FormField} type="input" label="Name" className="form-control" />

        <Field name="startDate" component={DatePickerField} change={change} className="form-control" />
        <div className="modal-date-picker">
          <Field name="endDate" type="date" component={FormField} label="End Date" />
        </div>

        <Field name="description" component={FormField} type="textarea" label="Description" className="form-control" />
      </FormModal>
    );
  }
}

const mapStateToProps = state => {
  return {
    regions: state.regions,
  };
};

const editEventConnect = connect(
  mapStateToProps,
  { editEvent, createEvent }
)(EditEventForm);

export default reduxForm({ form: 'editEventForm', enableReinitialize: true })(editEventConnect);
