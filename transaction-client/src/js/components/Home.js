import React from 'react';
import { UncontrolledCarousel, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import CardWrapper from './ui/CardWrapper';

import * as Constants from '../Constants';

const carouselIds = ['01', '02', '03', '04'];

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
              <h4 className="text-center">Welcome to TransAction</h4>
              <p>
                TransAction is a voluntary initiative sponsored by the ministry’s Employee Advisory Forum (EAF) and
                ministry executive as a fun, dynamic way of getting active during Healthy Workplace Month (October).
                Ministry employees are encouraged to form teams of five colleagues and earn “fitness points.” Not only
                do teams compete against one another, but individual time will also help each geographic area compete in
                the four-way battle between regions and headquarters.
              </p>

              <p>
                To participate in TransAction, you will need to register into one of two categories. If you are
                competitive by nature and you strive to burn calories you will enter the Competitive category. If you
                are hoping to increase your activity but prefer a less competitive challenge, then you will register
                into the Recreational category. Each day you will enter your physical activity time on the TransAction
                website based on level of intensity and in 15-minute increments. Your fitness points will be
                automatically calculated. Prizes will be awarded to the top three highest ranking teams in both the
                Competitive and Recreational categories. There will also be a participation prize drawn every week so,
                if you have joined a TransAction team, you will be eligible to win the weekly prizes.
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
