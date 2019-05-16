import React from 'react';
import { UncontrolledCarousel, Row, Col } from 'reactstrap';

import BreadcrumbFragment from './fragments/BreadcrumbFragment';

const items = [
  {
    src: '/images/carousel01.jpg',
    caption: '',
    altText: '',
    header: '',
  },
  {
    src: '/images/carousel02.jpg',
    caption: '',
    altText: '',
    header: '',
  },
  {
    src: '/images/carousel03.jpg',
    caption: '',
    altText: '',
    header: '',
  },
];

class Home extends React.Component {
  state = { slides: [] };

  componentDidMount() {
    this.setState({ slides: items });
  }

  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment />
        <Row>
          <Col sm="6">
            <div className="large-welcome-text">Welcome to TransAction</div>
          </Col>
          <Col sm="6">
            <UncontrolledCarousel items={this.state.slides} />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Home;
