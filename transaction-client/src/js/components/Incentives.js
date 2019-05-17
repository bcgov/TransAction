import React, { Component } from 'react';
import { BreadcrumbItem } from 'reactstrap';

import BreadcrumbFragment from './fragments/BreadcrumbFragment';

class Incentives extends Component {
  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment>
          <BreadcrumbItem active>Incentives</BreadcrumbItem>
        </BreadcrumbFragment>

        <div>
          To keep us all encouraged as we follow our TransAction - Healthy Workplace Challenge, we have lots of
          incentives, such as the ones you see in the pictures here! Door prizes will be drawn weekly, and a grand prize
          will go to the victorious team.{' '}
        </div>
      </React.Fragment>
    );
  }
}

export default Incentives;
