import React from 'react';
import { UncontrolledCarousel, Row, Col } from 'reactstrap';

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
      <Row>
        <Col>
          <UncontrolledCarousel items={this.state.slides} />
        </Col>
      </Row>
    );
  }
}

export default Home;
