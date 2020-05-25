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
    const { input, maxDate } = this.props;

    if (!input.value) {
      this.props.input.onChange(moment.min(moment(), moment(maxDate)).toDate());
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
      placeholderText,
      minDate,
      maxDate,
    } = this.props;

    const date = input.value
      ? moment(input.value, 'YYYY-MM-DD').toDate()
      : moment.min(moment(), moment(maxDate)).toDate();

    return (
      <FormGroup>
        <Label>{label}</Label>
        <div>
          <DatePicker
            {...input}
            selected={date}
            onChange={this.handleOnChange}
            onFocus={this.handleOnFucus}
            className={className}
            todayButton={todayButton}
            dateFormat={dateFormat}
            placeholderText={placeholderText}
            minDate={minDate}
            maxDate={maxDate}
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
  placeholderText: PropTypes.string,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
};

DatePickerInput.defaultProps = {
  className: 'form-control',
  dateFormat: 'yyyy-MM-dd',
};

export default DatePickerInput;
