import React from 'react';
import { Form } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';

class ProfileOfficeForm extends React.Component {
  onChange = event => {
    //console.log(event.target.value);
    const regionObj = { regionId: event.target.value };
    this.onSubmit(regionObj);
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  renderDropdown = () => {
    const options = this.props.regions.map(region => (
      <option key={region.id} value={region.id}>
        {region.name}
      </option>
    ));

    return options;
  };

  render() {
    //console.log(this.props.initialValues.region);
    return (
      <div>
        {' '}
        Region:
        <Form className="regionForm ml-3">
          <Field name="regionId" component="select" onChange={this.onChange} className="form-control">
            {this.renderDropdown()}
          </Field>
        </Form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'userregionform',
})(ProfileOfficeForm);
