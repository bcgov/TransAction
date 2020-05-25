import React from 'react';
import { UncontrolledCarousel, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import CardWrapper from './ui/CardWrapper';

import * as Constants from '../Constants';

const carouselIds = ['01', '02', '03', '04', '05', '06', '07', '08'];

class Home extends React.Component {
  state = { slides: [] };

  componentDidMount() {
    this.setState({
      slides: carouselIds.map((item) => {
        return {
          src: `${process.env.PUBLIC_URL}/images/carousel${item}.jpg`,
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
                TransAction Wellness is brought to you by your Employee Advisory Forum. This event was created as an
                opportunity for everyone to explore the various dimensions of their personal health and well-being.
                TransAction Wellness will run from June 1-30.
              </p>
              <h6>Create or join a team:</h6>
              <p>
                To participate in TransAction Wellness, you can either join a team of people, create a team, or join
                individually by clicking the Get Started button below. If you would like to make yourself available to
                join any team in the ministry, click Join Team and then click Become Free Agent. Teams can have a
                maximum of five members.
              </p>
              <h6>Logging your activity:</h6>
              <p>
                To log your activity, click on the Events page and select TransAction Wellness. Click on Log Activity to
                enter your activity in 15-minute increments. Please note that all the activities are listed as Low
                intensity. This event is not a competition, it is a tool to help log your activities and encourage each
                of us to make healthy choices. If your activity isn’t listed, select “Other” and you will be prompted to
                provide a short description of the activity performed.
              </p>
              <h6>Prizes:</h6>
              <p>
                There will be a participation prize drawn every week so be sure to log your activity for a chance to
                win!
              </p>
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
