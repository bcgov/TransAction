import React, { Component } from 'react';
import { Spinner } from 'reactstrap';

class PageSpinner extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="text-center my-5 page-spinner">
        <Spinner color="primary" />
      </div>
    );
  }
}

export default PageSpinner;
