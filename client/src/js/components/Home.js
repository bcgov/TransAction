import React from 'react';
import { UncontrolledCarousel, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import CardWrapper from './ui/CardWrapper';

import * as Constants from '../Constants';

// const carouselIds = ['01', '02', '03', '04', '05', '06', '07', '08'];
const carouselIds = ['wellness1', 'wellness2', 'wellness3', 'wellness4', 'wellness5', 'wellness6'];

class Home extends React.Component {
  state = { slides: [] };

  componentDidMount() {
    this.setState({
      slides: carouselIds.map((item) => {
        return {
          src: `${process.env.PUBLIC_URL}/images/${item}.jpg`,
          caption: '',
          altText: '',
          header: '',
        };
      }),
    });
  }

  render() {
    return (
      <React.Fragment>
        <CardWrapper style={{ marginTop: '16px' }}>
          <Row>
            <Col>
              <UncontrolledCarousel items={this.state.slides} />
            </Col>
          </Row>
        </CardWrapper>
        <CardWrapper>
          <Row>
            <Col>
              <h3 className="text-center">Welcome to TransAction</h3>
              <p className="text-center">
                <strong>
                  <em>
                    Please note the new and improved TransAction website is best
                    <br /> used with Microsoft Edge, Google Chrome or Mozilla Firefox.
                  </em>
                </strong>
              </p>
              <p>
                This voluntary initiative is sponsored by your Employee Advisory Forum and your ministry executive as a
                fun, dynamic way of getting active and supporting total health and wellbeing. You can participate in
                different events, like TransAction Healthy Workplace Challenge and TransAction Wellness, hosted by the
                EAF through this webpage. Individuals enter daily activities, and you monitor progress and standings on
                the homepage.
              </p>
              <p>To find an active event, click 'Get Started' below and click on each event to learn more!</p>
              <div className="text-center mt-5">
                <Link to={Constants.PATHS.START}>
                  <Button color="primary">Get Started</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </CardWrapper>
        <CardWrapper>
          <Row>
            <Col>
              <a href="http://gww.th.gov.bc.ca/EAF_TRANNET/" target="_blank" rel="noopener noreferrer">
                <img
                  className="w-100"
                  src={`${process.env.PUBLIC_URL}/images/eaf-banner.jpg`}
                  alt="Employee Advisory Forum"
                />
              </a>
            </Col>
          </Row>
        </CardWrapper>
      </React.Fragment>
    );
  }
}

export default Home;
