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
      </Container>
    );
  }
}

export default Incentives;
