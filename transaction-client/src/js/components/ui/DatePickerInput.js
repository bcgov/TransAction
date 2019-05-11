import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class DatePickerInput extends React.Component {
  handleOnChange = date => {
    this.props.input.onChange(date);
  };

  handleOnFucus = e => {
    const { input } = this.props;

    if (!input.value) {
      this.props.input.onChange(new Date());
    }

    input.onFocus(e);
  };

  render() {
    const {
      input,
      label,
      meta: { touched, error },
      className,
      todayButton,
      dateFormat,
    } = this.props;

    return (
      <FormGroup>
        <Label>{label}</Label>
        <div>
          <DatePicker
            {...input}
            selected={input.value ? moment(input.value).toDate() : new Date()}
            onChange={this.handleOnChange}
            onFocus={this.handleOnFucus}
            className={className}
            todayButton={todayButton}
            dateFormat={dateFormat}
          />
        </div>
        {touched &&
          (error && (
            <div className="text-danger mt-1">
              <FontAwesomeIcon icon="exclamation-circle" /> {error}
            </div>
          ))}
      </FormGroup>
    );
  }
}

DatePickerInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  todayButton: PropTypes.string,
  dateFormat: PropTypes.string,
};

DatePickerInput.defaultProps = {
  className: 'form-control',
  dateFormat: 'YYYY-MM-dd',
};

export default DatePickerInput;
