import React from 'react';
import { Button, Spinner } from 'reactstrap';

class SpinnerButton extends React.Component {
  state = { clicked: false };

  toggleClicked = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  handleOnClick = () => {
    this.toggleClicked();
  };

  render() {
    const { children, size, color } = this.props;
    return (
      <Button onClick={this.handleOnClick} size={size} color={color}>
        {this.state.clicked && <Spinner size="sm" />} {children}
      </Button>
    );
  }
}

export default SpinnerButton;
