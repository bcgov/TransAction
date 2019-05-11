import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormInput = ({ label, type, input, meta: { touched, error }, children }) => {
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Input type={type} {...input} autoComplete="off">
        {children}
      </Input>
      {touched &&
        (error && (
          <div className="text-danger mt-1">
            <FontAwesomeIcon icon="exclamation-circle" /> {error}
          </div>
        ))}
    </FormGroup>
  );
};

export default FormInput;
