import React from 'react';
import MyButtons from './MyButtons';
import { Button, ButtonGroup } from 'reactstrap';

const ArchivedEvent = props => {
  return (
    <ButtonGroup>
      <MyButtons name={props.name} />
    </ButtonGroup>
  );
};

export default ArchivedEvent;
