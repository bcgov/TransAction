import React from 'react';
import { FormGroup, Label } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class DatePickerInput extends React.Component {
  state = { date: new Date() };

  handleOnChange = date => {
    this.props.input.onChange(date);
  };

  handleOnFucus = e => {
    const { input } = this.props;

    if (!input.value) {
      this.props.input.onChange(this.state.date);
    }

    input.onFocus(e);
  };

  render() {
    const {
      input,
      label,
      meta: { touched, error },
    } = this.props;

    return (
      <FormGroup>
        <Label>{label}</Label>
        <div>
          <DatePicker
            {...input}
            selected={input.value ? moment(input.value).toDate() : this.state.date}
            onChange={this.handleOnChange}
            onFocus={this.handleOnFucus}
            className="form-control"
            todayButton={'Today'}
            dateFormat="YYYY-MM-dd"
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

export default DatePickerInput;
