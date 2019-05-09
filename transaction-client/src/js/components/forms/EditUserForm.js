import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { FormGroup, Label } from 'reactstrap';

import { editUser } from '../../actions';

import FormModal from '../ui/FormModal';

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
        <FormGroup>
          <Label for="regionId">Region</Label>
          <Field name="regionId" component="select" className="form-control">
            {this.renderRegionOptions()}
          </Field>
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Field name="description" component="textarea" className="form-control" />
        </FormGroup>
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
