import React, { Component } from 'react';
import { Container, Row, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';

class Incentives extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Incentives</BreadcrumbItem>
          </Breadcrumb>
        </Row>

        <div id="centerText">
          To keep us all encouraged as we follow our TransAction - Healthy Workplace Challenge, we have lots of
          incentives, such as the ones you see in the pictures here! Door prizes will be drawn weekly, and a grand prize
          will go to the victorious team.{' '}
        </div>
      </Container>
    );
  }
}

export default Incentives;
