import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input, Popover, PopoverBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class FormInput extends React.Component {
  state = { showPointTip: false };

  togglePointTip = param => {
    this.setState({ showPointTip: param });
  };

  renderToolTip(target, tooltipText) {
    return (
      <Popover placement="top" isOpen={this.state.showPointTip} target={target}>
        <PopoverBody>{tooltipText}</PopoverBody>
      </Popover>
    );
  }

  render() {
    const {
      label,
      type,
      input,
      meta: { touched, error },
      children,
      placeholderText,
      tooltipText,
    } = this.props;

    return (
      <FormGroup>
        {label.length > 0 && (
          <Label>
            {label}{' '}
            {tooltipText && (
              <FontAwesomeIcon
                className="text-primary hover-pointer"
                id={`${input.name}-label`}
                icon="question-circle"
                onMouseOver={() => this.togglePointTip(true)}
                onMouseOut={() => this.togglePointTip(false)}
              />
            )}
          </Label>
        )}
        <Input type={type} {...input} autoComplete="off" placeholder={placeholderText}>
          {children}
        </Input>
        {touched &&
          (error && (
            <div className="text-danger mt-1">
              <FontAwesomeIcon icon="exclamation-circle" /> {error}
            </div>
          ))}
        {tooltipText && this.renderToolTip(`${input.name}-label`, tooltipText)}
      </FormGroup>
    );
  }
}

FormInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  children: PropTypes.array,
  placeholderText: PropTypes.string,
  tooltipText: PropTypes.string,
};

export default FormInput;
