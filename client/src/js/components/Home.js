import React, { useEffect, useState } from 'react';
import { UncontrolledCarousel, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import CardWrapper from './ui/CardWrapper';

import * as Constants from '../Constants';

const carouselIds = ['wellness1', 'wellness2', 'wellness3', 'wellness4', 'wellness5', 'wellness6'];

const Home = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    setSlides(
      carouselIds.map((item) => ({
        src: `${process.env.PUBLIC_URL}/images/${item}.jpg`,
        caption: '',
        altText: '',
        header: '',
      }))
    );
  }, []);

  return (
    <>
      <CardWrapper style={{ marginTop: '16px' }}>
        <Row>
          <Col>
            <UncontrolledCarousel items={slides} />
          </Col>
        </Row>
      </CardWrapper>
      <CardWrapper>
        <Row>
          <Col>
            <h3 className="text-center">Welcome to TransAction</h3>
            <p className="text-center text-danger">
              <strong>
                <em>
                  REMINDER: Activities up to November 4, 2022 can be logged in the TransAction site until end of day Monday, November 7, 2022.
                </em>
              </strong>
            </p>

            <p className="text-center">
              <strong>
                <em>
                  Please note the TransAction website is best
                  <br /> used with Microsoft Edge, Google Chrome or Mozilla Firefox.
                </em>
              </strong>
            </p>
            <div>
              <p className="text-center">
                This voluntary initiative is a fun, dynamic way of getting active and supporting total health and wellbeing.
              </p>

              <p className="text-center">
                Over the month of October, the TransAction wellness program is hosted by the EAF through this webpage. You can create a team of five with members/teammates located anywhere in the province!
              </p>

              <p className="text-center">
                Individuals enter daily activities, and you can monitor progress and standings on the homepage.
              </p>
              <p className="text-center">To find an active event, click 'Get Started' below and click on each event to learn more!</p>
            </div>

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
    </>
  );
};

export default Home;
