import React from 'react';
import { Row, Col } from 'reactstrap';
import Markdown from 'react-markdown';

import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as Constants from '../Constants';

const faqItems1 = [
  {
    q: 'Why am I experiencing technical difficulties?',
    a: 'The new and improved TransAction is best used with Microsoft Edge, Google Chrome or Mozilla Firefox. You’ll experience technical difficulties if you are using Internet Explorer.',
  },
  {
    q: 'Which event do I enter?',
    a: 'One of the exciting changes this year is the introduction of two new categories: Competitive and Recreational. If you are competitive by nature and you strive to burn calories daily, you will enter the Competitive category. If you are looking to increase your physical activity and have fun with your colleagues, but prefer a less competitive challenge, then you will enter the Recreational category. All team members should log their activity in the same category each week.',
  },
  {
    q: 'How do I log my activity?',
    a: 'Once you have joined a team, you can enter your activity by clicking on the Events page and then selecting your chosen category (Competitive or Recreational). Once selected, click Log Activity.',
  },
  // Other questions and answers
];

const faqItems2 = [
  {
    q: 'Why am I experiencing technical difficulties?',
    a: 'TransAction Wellness is best used with Microsoft Edge or Google Chrome. You’ll experience technical difficulties if you are using Internet Explorer.',
  },
  {
    q: 'How is TransAction Wellness different from TransAction: Healthy Workplace Challenge?',
    a: 'TransAction Wellness is based on participation, so there is no competition for earning the most points between teams. That being said, you can log your activities just like the regular TransAction event, make your own teams, and use the Message Board to talk about your experience, share resources (such as your favourite online workout) and motivate your colleagues.',
  },
  {
    q: 'How many people need to be on a team?',
    a: 'Since teams won’t be competing with one another during this event, it makes no difference how many people are on a team. You can create your own team and be the sole member, although we encourage people to form teams with their colleagues for mutual support. The maximum number of team members remains five. If you would like to add members to your team, you can pick names from the Free Agent Pool. Remember, you can be from different parts of the province and still be on the same team.',
  },
  // Other questions and answers
];

const FAQ = () => {
  const renderContent = () => (
    <Row>
      <Col>
        <h4>Frequently Asked Questions</h4>
        <br />
        <h5 id="health">TransAction Healthy Workplace Challenge</h5>
        <div className="mt-3">
          {faqItems1.map((item, index) => (
            <CardWrapper key={index}>
              <h6>{item.q}</h6>
              <Markdown children={item.a} allowedElements={Constants.MARKDOWN.ALLOWED} />
            </CardWrapper>
          ))}
        </div>
        <h5 id="wellness">TransAction Wellness</h5>
        <div className="mt-3">
          {faqItems2.map((item, index) => (
            <CardWrapper key={index}>
              <h6>{item.q}</h6>
              <Markdown children={item.a} allowedElements={Constants.MARKDOWN.ALLOWED} />
            </CardWrapper>
          ))}
        </div>
      </Col>
    </Row>
  );

  return (
    <>
      <BreadcrumbFragment>{[{ active: true, text: 'FAQ' }]}</BreadcrumbFragment>
      {renderContent()}
    </>
  );
};

export default FAQ;
