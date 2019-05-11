import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class DatePickerField extends React.Component {
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
    const { input } = this.props;

    return (
      <DatePicker
        {...input}
        selected={input.value ? moment(input.value).toDate() : this.state.date}
        onChange={this.handleOnChange}
        onFocus={this.handleOnFucus}
        className="form-control"
        todayButton={'Today'}
        dateFormat="YYYY-MM-dd"
      />
    );
  }
}

export default DatePickerField;
