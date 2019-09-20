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
      slides: carouselIds.map(item => {
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
                TransAction is a voluntary initiative sponsored by the ministry’s Employee Advisory Forum and ministry
                executive as a fun, dynamic way of getting active during Healthy Workplace Month (October). Not only do
                teams compete against one another, but individual time will also help each geographic area compete in
                the four-way battle between regions and headquarters.
              </p>

              <p>
                <h6>Create/Join a Team</h6>
                To participate in TransAction, you will need to join a team of people you know or create a team by
                clicking the Get Started button below. Teams can have a maximum of five members. If you would like to
                make yourself available to join any team in the ministry you will select Join Team and then Become Free
                Agent. Teams can have a maximum of five members.
              </p>
              <p>
                <h6>Selecting a Category: Competitive or Recreational</h6>
                One of the exciting changes this year is the introduction of two new categories on the Events page:
                Competitive and Recreational. If you are competitive by nature and you strive to burn calories daily,
                you will enter the Competitive category. If you are looking to increase your physical activity but
                prefer a less competitive challenge, then you will enter the Recreational category. Your teammates will
                need to discuss which category you want to participate in. Be sure to log your activity in the same
                category each week.
              </p>
              <p>
                <h6>Logging Your Activity</h6>
                To log your activity, click on the Events page and select your chosen category: Competitive or
                Recreational. Click on Log Activity to enter your activity in 15-minute increments based on intensity
                from the dropdown list. If your activity isn’t listed, choose the intensity performed (i.e. Low, Medium
                or High) and select “Other.” You will be prompted to provide a short description of the activity
                performed.
              </p>
              <p>
                <h6>Prizes</h6>
                Your "fitness points" will be automatically calculated and prizes will be awarded to the top three
                highest ranking teams in both the Competitive and Recreational categories. There will also be a
                participation prize drawn every week so long as you have joined a TransAction team, you will be eligible
                to win!
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
