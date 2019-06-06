import React from 'react';
import { BreadcrumbItem, Row, Col } from 'reactstrap';

import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

class FAQ extends React.Component {
  renderContent = () => {
    return (
      <Row>
        <Col>
          <h4>Frequently Asked Questions</h4>
          <div className="mt-3">
            <h6>What counts as an activity?</h6>
            <p>
              Any physical activity that is more than 15 consecutive minutes that challenges your current level of
              fitness should count. For example, if you are shovelling snow, this could certainly count. However, if you
              are sweeping hardwood floors at home, this probably shouldn't count. Please be mindful that we are
              focusing on recreation as opposed to "work." Part of the purpose of TransAction is to help folks adopt
              healthy behaviours which become healthy recreational habits. Since TransAction is based on the honour
              system, please use your most honourable discretion.
            </p>

            <h6>
              I walked eight minutes to the restaurant at lunch, then sat down and had lunch for 30 minutes and walked
              eight minutes back to the office. Can I enter my time as 15 minutes?
            </h6>
            <p>
              No. All activity recorded is defined in increments of 15 minutes. This means continuous activity for 15
              minutes. Please do not save up time (five minutes here, 10 minutes there, and so on). The intention of
              this fitness challenge is to get out and be active <u>in addition</u> to your normal daily activity.
              Challenge yourself to start a new healthy habit!
            </p>
            <h6>What do the three levels of intensity mean?</h6>
            <p>
              The ability to weight exercise based on intensity was introduced for TransAction 2013. High, medium and
              low intensity exercises are multiplied by factors of 3, 2, and 1, respectively. To help avoid any
              confusion and make it easier for participants, in 2019 we added the ability for you to select what
              activity you participated in; overall exercise points will then be calculated automatically when the
              activity is entered in the calendar.{' '}
            </p>
            <p>
              High intensity: Activities where you are borderline uncomfortable. You are short of breath and can speak a
              sentence at most.
            </p>
            <p>
              Moderate intensity: Activities that cause you to breathe heavily. You can hold short conversations. Still
              somewhat comfortable, but challenging.
            </p>
            <p>
              Light intensity: These activities you feel you can maintain for hours. You find it easy to breathe and
              carry a conversation.
            </p>
            <p>
              Again, this is just meant to be a general guide, and to even out the playing field for all interests and
              activity types. Participants are encouraged to use their best guess with respect to intensity.
            </p>

            <h6>Does each member have to register individually before I can add them as team leader?</h6>
            <p>
              Yes. To add members to your team, they must first go to the website and register. To do this, they click
              Member Information, verify their name and office, and then click Register. Next, they add themselves to
              the Selection Pool. You may then draw anyone from the Selection Pool for your team, providing you have not
              reached the maximum allowable members (5). Team leads may also “recruit” people into their team.
            </p>

            <h6>I am going to be on vacation, can someone else enter my information on the website?</h6>
            <p>
              No, unfortunately, only you can enter your time. While you are on vacation, keep a log of your time and
              enter it when you return. Alternatively, try to make it into the office while you are off. (Just kidding!)
            </p>

            <h6>
              Since our office only consists of three employees (two full time and one auxiliary), can we receive any
              special consideration?
            </h6>
            <p>
              No, you will not receive special consideration, but you can still add two more people from the Selection
              Pool. Teammates can come from anywhere in the province. The team leader must go to Team Information and
              add new team members from the selection pool. Check the message board for those seeking a team. Take this
              opportunity to include someone you haven't met! There may be a solitary marathon runner waiting to be
              snapped up by your team! If you decide to add from the Selection Pool, please inform the person to ensure
              they are aware. Remember, it's about having fun while promoting physical activity.
            </p>

            <h6>Can I be on more than one team?</h6>
            <p>No - anyone who is already registered on a team cannot be on another team.</p>

            <h6>Can you have smaller teams (i.e. less than five team members)?</h6>
            <p>
              Yes. You can go with less than five people, although it's not recommended as it will take longer to
              collect fitness points as a team. Alternatively, you can pick names from the Selection Pool to add them to
              your team to make five. (Check the Message Board!) Remember, you can be from different parts of the
              province and still be on the same team.
            </p>

            <h6>
              We have a team member who is unable to continue participating, but has some time logged. Are we able to
              replace them with another person?
            </h6>
            <p>
              Yes. You can replace a team member if required. The team leader goes to Member Information and deletes the
              leaving member. This action will free a spot on your team and allow the team leader to add a new member
              from the Selection Pool.
            </p>
          </div>
        </Col>
      </Row>
    );
  };
  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment>
          <BreadcrumbItem active>FAQ</BreadcrumbItem>
        </BreadcrumbFragment>

        <CardWrapper>{this.renderContent()}</CardWrapper>
      </React.Fragment>
    );
  }
}

export default FAQ;
