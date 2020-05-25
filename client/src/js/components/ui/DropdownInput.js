import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class DropdownInput extends React.Component {
  state = { submitting: false, loading: false, dropdownOpen: false, title: '' };

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  };

  handleOnSelect = item => {
    this.props.input.onChange(item.value);
    this.setState({ title: item.description });
  };

  renderMenuItems = () => {
    return this.props.menuItems.map((item, index) => {
      if (item.type === 'header') {
        return (
          <DropdownItem header key={index}>
            {item.text}
          </DropdownItem>
        );
      } else {
        return (
          <DropdownItem key={index} onClick={() => this.handleOnSelect(item)}>
            {item.text}
          </DropdownItem>
        );
      }
    });
  };

  render() {
    const {
      label,
      meta: { touched, error },
      title,
    } = this.props;

    return (
      <FormGroup>
        <Label>{label}</Label>
        <div>
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="form-input">
            <DropdownToggle caret>{this.state.title ? this.state.title : title}</DropdownToggle>
            <DropdownMenu>{this.renderMenuItems()}</DropdownMenu>
          </Dropdown>
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

DropdownInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  menuItems: PropTypes.array.isRequired,
  className: PropTypes.string,
};

DropdownInput.defaultProps = {
  className: 'form-input',
};

export default DropdownInput;
