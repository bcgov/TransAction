import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';

const BreadcrumbFragment = ({ children }) => {
  return (
    <Row>
      <Col>
        <Breadcrumb>
          <BreadcrumbItem active={!children}>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          {children}
        </Breadcrumb>
      </Col>
    </Row>
  );
};

export default BreadcrumbFragment;
