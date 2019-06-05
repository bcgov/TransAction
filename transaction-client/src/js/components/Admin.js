import React, { Component } from 'react';
import { BreadcrumbItem } from 'reactstrap';

import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

class Admin extends Component {
  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment>
          <BreadcrumbItem active>Admin</BreadcrumbItem>
        </BreadcrumbFragment>

        <CardWrapper />
      </React.Fragment>
    );
  }
}

export default Admin;
