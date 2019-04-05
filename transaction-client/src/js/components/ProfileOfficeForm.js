import React from 'react';
import { Form, Input } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';

class ProfileOfficeForm extends React.Component {
  onChange = event => {
    //console.log(event.target.value);
    const regionObj = { region: event.target.value };
    this.onSubmit(regionObj);
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  renderDropdown = () => {
    const testRegion = this.props.userRegion;
    console.log(testRegion);
    const options = this.props.regions.map(function(region) {
      if (testRegion === region.region) {
        return (
          <option key={region.id} value={region.id} selected>
            {region.region}
          </option>
        );
      } else {
        return (
          <option key={region.id} value={region.id}>
            {region.region}
          </option>
        );
      }
    });

    return options;
  };

  renderInput = ({ input, type }) => {
    //console.log(this.props.initialValues);
    return (
      <Input type={type} {...input} autoComplete="off" value={this.props.initialValues.region} onChange={this.onChange}>
        {this.renderDropdown()}
      </Input>
    );
  };
  render() {
    //console.log(this.props.initialValues.region);
    return (
      <div>
        {' '}
        Region:
        <Form className="regionForm ml-3">
          <Field name="description" component={this.renderInput} type="select" />
        </Form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'userregionform',
})(ProfileOfficeForm);
