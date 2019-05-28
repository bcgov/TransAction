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
          src: `/images/carousel${item}.jpg`,
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
              {/* <div className="large-welcome-text text-center mb-4">Welcome to TransAction</div> */}
              <UncontrolledCarousel items={this.state.slides} />
            </Col>
          </Row>
        </CardWrapper>
        <CardWrapper>
          <Row>
            <Col>
              <h4 className="text-center">Welcome to TransAction</h4>
              <p>
                TransAction (Healthy Workplace Challenge) is a voluntary initiative sponsored by the ministry’s Employee
                Advisory Forum (EAF) and ministry executive as a fun, dynamic way of getting active during Healthy
                Workplace Month (October). Ministry employees are encouraged to form teams of five with colleagues and
                earn “fitness points”. Not only do teams compete against one another, but individual time will also help
                his/or geographic area compete in the 4-way battle between regions and headquarters.
              </p>

              <p>
                A ministry employee participates in TransAction by registering and becoming a member of a team (as a
                team leader or regular team member). Each individual enters daily physical activity time on the
                TransAction website based on level of intensity and in 15-minute increments, and points are calculated.
                Prizes are awarded to the highest ranking team. There are also random prize draws throughout the
                duration of the program. The next TransAction is scheduled to take place in October 2017, this program
                has been running since October 2010 and we hope to support this initiative for many years to come.
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
              <img className="w-100" src="/images/eaf-banner.jpg" alt="Employee Advisory Forum" />
            </Col>
          </Row>
        </CardWrapper>
      </React.Fragment>
    );
  }
}

export default Home;
