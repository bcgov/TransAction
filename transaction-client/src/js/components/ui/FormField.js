import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

const FormField = ({ label, type, input, children }) => {
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Input type={type} {...input} autoComplete="off">
        {children}
      </Input>
    </FormGroup>
  );
};

export default FormField;
