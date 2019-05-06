import React, { Component } from 'react';
import { Container, Breadcrumb, BreadcrumbItem, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
class FAQ extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>FAQ</BreadcrumbItem>
          </Breadcrumb>
        </Row>
      </Container>
    );
  }
}

export default FAQ;
