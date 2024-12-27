import React from 'react';
import { Spinner } from 'reactstrap';

const PageSpinner = () => {
  return (
    <div className="text-center my-5">
      <Spinner
        color="primary"
        style={{
          height: '3rem',
          width: '3rem'
        }}
        type="grow"
      >
        Loading...
      </Spinner>
    </div>
  );
};

export default PageSpinner;
