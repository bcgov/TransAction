import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';

const BreadcrumbFragment = ({ children }) => {
  const items = children.map((child, index) => {
    return (
      <BreadcrumbItem active={child.active} key={index} className="d-inline-block text-truncate">
        {child.link ? <Link to={child.link}>{child.text}</Link> : child.text}
      </BreadcrumbItem>
    );
  });

  return (
    <Row>
      <Col>
        <Breadcrumb>
          <BreadcrumbItem active={!children}>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          {items}
        </Breadcrumb>
      </Col>
    </Row>
  );
};

export default BreadcrumbFragment;
