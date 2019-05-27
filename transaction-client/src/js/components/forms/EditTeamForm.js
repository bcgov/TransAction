import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import { editTeam, createTeam } from '../../actions';

import FormModal from '../ui/FormModal';
import FormInput from '../ui/FormInput';

import * as Constants from '../../Constants';

class EditTeamForm extends React.Component {
  state = { submitting: false };

  onInit = () => {
    this.props.initialize(this.props.initialValues);
  };

  onSubmit = formValues => {
    if (!this.state.submitting) {
      this.setState({ submitting: true });
    }

    if (this.props.formType === Constants.FORM_TYPE.ADD) {
      this.props.createTeam(formValues).then(() => {
        //this.toggleModal();
      });
    } else {
      this.props.editTeam(formValues.id, formValues).then(() => {
        this.toggleModal();
      });
    }
  };

  toggleModal = () => {
    this.setState({ submitting: false });

    this.props.toggle();
  };

  renderRegionOptions() {
    const regionOptions = Object.values(this.props.regions).map(region => {
      return (
        <option value={region.id} key={region.id}>
          {region.name}
        </option>
      );
    });

    regionOptions.unshift(<option value={0} key={0} />);
    regionOptions.unshift(
      <option value={-1} key={-1}>
        Select a region
      </option>
    );

    return regionOptions;
  }

  render() {
    const title = this.props.formType === Constants.FORM_TYPE.ADD ? 'Create Team' : 'Edit Team';

    return (
      <FormModal
        onSubmit={this.onSubmit}
        toggle={this.toggleModal}
        submitting={this.state.submitting}
        onInit={this.onInit}
        {..._.pick(this.props, ['isOpen', 'handleSubmit', 'pristine'])}
        title={title}
      >
        <Field name="name" component={FormInput} type="text" label="Name" placeholderText="Enter team name" />
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
        <Field
          name="goal"
          component={FormInput}
          type="text"
          label="Goal"
          placeholderText="Enter team point goal"
          tooltipText="The TransAction points goal for your team. Points are calculated using your team's workout
          intensity and duration. One minute of workout equals one point, and then multiplied by the workout
          intensity."
        />
      </FormModal>
    );
  }
}

EditTeamForm.propTypes = {
  regions: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

EditTeamForm.defaultProps = { regions: {}, isOpen: false, pristine: false };

const validate = formValues => {
  const errors = {};

  const goal = parseInt(formValues.goal);

  if (!formValues.regionId || formValues.regionId <= 0) {
    errors.regionId = 'Region required';
  }

  if (!formValues.name) {
    errors.name = 'Name required';
  }

  if (!formValues.description) {
    errors.description = 'Description required';
  }

  if (!formValues.goal || isNaN(formValues.goal)) {
    errors.goal = 'Please enter a valid number';
  }

  if (goal >= 10000000) {
    errors.goal = 'Please set a smaller goal :)';
  }

  return errors;
};

const form = reduxForm({ form: 'editTeamForm', enableReinitialize: true, validate })(EditTeamForm);

const mapStateToProps = state => {
  return {
    regions: state.regions,
  };
};

const formConnect = connect(
  mapStateToProps,
  { editTeam, createTeam }
)(form);

export default formConnect;
