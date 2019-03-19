import React from 'react';
import { Button } from 'reactstrap';

class Buttons extends React.Component {
  render() {
    return <Button color="primary">{this.props.name}</Button>;
  }
}

export default Buttons;
