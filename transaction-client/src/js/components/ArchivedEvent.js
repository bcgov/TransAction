import React from 'react';
import Buttons from './Buttons';
import { Button, ButtonGroup } from 'reactstrap';

const ArchivedEvent = props => {
  return (
    <ButtonGroup>
      <Buttons name={props.name} />
    </ButtonGroup>
  );
};

export default ArchivedEvent;
