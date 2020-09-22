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
              <h3 className="text-center">Welcome to TransAction Wellness</h3>
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
              <p>
                <h5>Get Started</h5>
              </p>
              <p>
                <strong>
                  <em>How does TransAction Healthy Workplace Challenge work?</em>
                </strong>
              </p>
              <h6>Create or join a team:</h6>
              <p>
                To participate in an event, you can either join a team of people, create a team, or join individually by
                clicking the Get Started button below. If you would like to make yourself available to join any team in
                the ministry, click Join Team and then click Become Free Agent. Teams can have a maximum of five
                members.
              </p>
              There are two categories on the Events page for TransAction Healthy Workplace Challenge:{' '}
              <strong>Competitive</strong> and <strong>Recreational</strong>.<p></p>
              <ul>
                <li>
                  If you are competitive by nature and you strive to burn calories daily, you will enter the{' '}
                  <strong>Competitive category</strong>.
                </li>
                <li>
                  If you are looking to increase your physical activity but prefer a less competitive challenge, then
                  you will enter the <strong>Recreational category</strong>.
                </li>
              </ul>
              <p>
                Your teammates will need to discuss which category you want to participate in. Be sure to log your
                activity in the same category each week.
              </p>
              <p>
                You will not only compete against other teams within your category, but your individual time will also
                help your geographic area compete in the 4-way battle between regions and headquarters.
              </p>
              <p>
                Exercise time is entered for each day and points are assigned based on the activity. The activity you
                selected and the time entered is converted to points automatically. High, medium and low intensity
                exercises are multiplied by factors of 3, 2, and 1, respectively. You can view your activity log entries
                on the calendar.
              </p>
              <h6>Logging your activity:</h6>
              <p>
                To log your activity, click on the Events page and select your chosen category: Competitive or
                Recreational. Click on Log Activity to enter your activity in 15-minute increments based on intensity
                from the dropdown list. If your activity isn’t listed, choose the intensity performed (i.e. Low, Medium
                or High) and select “Other.” You will be prompted to provide a short description of the activity
                performed.
              </p>
              <h6>Prizes:</h6>
              <p>
                Your "fitness points" will be automatically calculated and prizes will be awarded to the top ranking
                teams in both the Competitive and Recreational categories. There will also be a participation prize
                drawn every week so long as you have joined a team, you will be eligible to win!
              </p>
              <p>Check out the FAQ for more information!</p>
              <p>
                <strong>
                  <em>How does TransAction Wellness work?</em>
                </strong>
              </p>
              <p>
                You participate in TransAction Wellness by creating or becoming a member of a team, or participating on
                your own. A team is composed of a leader and up to four team members. You can join a team or make
                yourself available to join any team in the ministry by becoming a Free Agent.
              </p>
              <p>
                Individuals enter daily activity time in TransAction Wellness, and you can monitor your team's progress
                on the homepage. All activities for this event hold the same low intensity level. This is not a
                competitive event. It is a tool to help encourage you to make healthy choices.
              </p>
              <p>You can view your activity log entries on the calendar.</p>
              <p>Check out the FAQ for more information!</p>
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
