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
          <Col>
            {/* <div className="large-welcome-text">Welcome to TransAction</div> */}
            <div>Welcome to TransAction</div>
            <p>Landing page work in progress...please use the menu at the top.</p>
          </Col>
        </Row>
        <Row>
          <Col>{/* <UncontrolledCarousel items={this.state.slides} /> */}</Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Home;
