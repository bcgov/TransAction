import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { editUser } from '../../actions';

import FormModal from '../ui/FormModal';
import FormField from '../ui/FormField';

class EditUserForm extends React.Component {
  state = { submitting: false };

  onSubmit = formValues => {
    if (!this.state.submitting) {
      this.setState({ submitting: true });
    }

    this.props.editUser(formValues.id, formValues).then(() => {
      this.toggleModal();
    });
  };

  toggleModal = () => {
    this.setState({ submitting: false });

    this.props.toggle();
  };

  renderRegionOptions() {
    return Object.values(this.props.regions).map(region => {
      return (
        <option value={region.id} key={region.id}>
          {region.name}
        </option>
      );
    });
  }

  render() {
    const { isOpen, handleSubmit } = this.props;

    return (
      <FormModal
        handleSubmit={handleSubmit}
        onSubmit={this.onSubmit}
        isOpen={isOpen}
        toggle={this.toggleModal}
        submitting={this.state.submitting}
        title="Edit Profile"
      >
        <Field name="regionId" component={FormField} type="select" label="Region" className="form-control">
          {this.renderRegionOptions()}
        </Field>
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

const editUserConnect = connect(
  mapStateToProps,
  { editUser }
)(EditUserForm);

export default reduxForm({ form: 'editUserForm', enableReinitialize: true })(editUserConnect);
