import React from 'react';
import { Button } from 'reactstrap';

class MyButton extends React.Component {
  render() {
    return <Button>{this.props.name}</Button>;
  }
}

export default MyButton;
