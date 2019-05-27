import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import { editUser } from '../../actions';

import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';

class EditUserForm extends React.Component {
  state = { submitting: false };

  onInit = () => {
    this.props.initialize(this.props.initialValues);
  };

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
    return (
      <FormModal
        onSubmit={this.onSubmit}
        toggle={this.toggleModal}
        submitting={this.state.submitting}
        onInit={this.onInit}
        {..._.pick(this.props, ['isOpen', 'handleSubmit', 'pristine'])}
        title="Edit Profile"
      >
        <Field name="regionId" component={FormInput} type="select" label="Region">
          {this.renderRegionOptions()}
        </Field>
        <Field
          name="description"
          component={FormInput}
          type="textarea"
          label="Description"
          placeholderText="Enter a short description about yourself"
        />
      </FormModal>
    );
  }
}

EditUserForm.propTypes = {
  regions: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

EditUserForm.defaultProps = { regions: {}, isOpen: false, pristine: false };

const validate = formValues => {
  const errors = {};

  if (!formValues.description) {
    errors.description = 'Description required';
  }

  return errors;
};

const form = reduxForm({ form: 'editUserForm', enableReinitialize: true, validate })(EditUserForm);

const mapStateToProps = state => {
  return {
    regions: state.regions,
  };
};

const formConnect = connect(
  mapStateToProps,
  { editUser }
)(form);

export default formConnect;
