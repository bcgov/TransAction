import React from 'react';
import { Spinner } from 'reactstrap';

const PageSpinner = () => {
  return (
    <div className="text-center my-5 page-spinner">
      <Spinner color="primary" />
    </div>
  );
};

export default PageSpinner;
