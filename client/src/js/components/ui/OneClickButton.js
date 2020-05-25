import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import _ from 'lodash';

class OneClickButton extends React.Component {
  state = { clicked: false };

  handleOnClick = () => {
    this.setState({ clicked: true });
    this.props.handleOnClick();
  };

  render() {
    const { children } = this.props;
    return (
      <Button
        {..._.pick(this.props, ['size', 'color', 'className'])}
        onClick={this.handleOnClick}
        disabled={this.state.clicked}
      >
        {children}
      </Button>
    );
  }
}

OneClickButton.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.string.isRequired,
  handleOnClick: PropTypes.func.isRequired,
};

export default OneClickButton;
