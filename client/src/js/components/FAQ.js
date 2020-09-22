import React from 'react';
import { Row, Col } from 'reactstrap';
import Markdown from 'react-markdown';

import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as Constants from '../Constants';

const faqItems1 = [
  {
    q: 'Why am I experiencing technical difficulties?',

    a:
      'The new and improved TransAction is best used with Microsoft Edge, Google Chrome or Mozilla Firefox. You’ll experience technical difficulties if you are using Internet Explorer.',
  },
  {
    q: 'Which event do I enter?',

    a:
      'One of the exciting changes this year is the introduction of two new categories: Competitive and Recreational. If you are competitive by nature and you strive to burn calories daily, you will enter the Competitive category. If you are looking to increase your physical activity and have fun with your colleagues, but prefer a less competitive challenge, then you will enter the Recreational category. All team members should log their activity in the same category each week.',
  },
  {
    q: 'How do I log my activity?',

    a:
      'Once you have joined a team, you can enter your activity by clicking on the Events page and then selecting your chosen category (Competitive or Recreational). Once selected, click Log Activity.',
  },
  {
    q: 'What counts as an activity?',

    a:
      'Any physical activity that is more than 15 consecutive minutes that challenges your current level of fitness should count. For example, if you are shovelling snow, this could certainly count. However, if you are sweeping hardwood floors at home, this probably shouldn\'t count. Please be mindful that we are focusing on recreation as opposed to "work". Part of the purpose of TransAction is to help folks adopt healthy behaviours which become healthy recreational habits. Since TransAction is based on the honour system, please use your most honourable discretion.',
  },
  {
    q: 'I walked eight minutes to the restaurant at lunch, then sat down and had lunch for 30 minutes and walked eight minutes back to the office. Can I enter my time as 15 minutes?',

    a: 'No. All activity recorded is defined in increments of 15 minutes. This means continuous activity for 15 minutes. Please do not save up time (five minutes here, 10 minutes there, and so on). The intention of this fitness challenge is to get out and be active in addition to your normal daily activity. Challenge yourself to start a new healthy habit!',
  },
  {
    q: 'What do the three levels of intensity mean?',
    a:
`The ability to weight exercise based on intensity was introduced for TransAction 2013. High, medium, and low intensity exercises are multiplied by factors of 3, 2, and 1 respectively. To help avoid any confusion and make it easier for participants, we have added the option to select your activity based on the intensity level performed. Some really important feedback we heard from previous participants is that you would like a little bit more direction in the split of activities. As always, your overall exercise points will then be calculated automatically when the activity is entered in the calendar.
* **High intensity**: Activities where you are borderline uncomfortable and sweating profusely. You are short of breath and can speak a sentence at most.
* **Moderate intensity**: Activities that cause you to breathe heavily and break a sweat. You can hold short conversations for at least part of the activity. Still somewhat comfortable, but challenging.
* **Low intensity**: These activities you feel you can maintain for hours. You may break a light sweat but you find it easy to breathe and carry a conversation throughout the entire activity.

This is meant to be a general guide and to even out the playing field for all interests and activity types. Participants are encouraged to use their best guess with respect to intensity.
`
  },
  {
    q: 'What if the activity I completed isn’t listed?',

    a:
      'If you completed an activity that is not available in the drop-down list, select the level of intensity (i.e. Low – Other, Medium – Other, High – Other) and then provide a short activity description. This will help us to expand the activity list for next year. Perhaps we have a large number of kick-boxers at our ministry? Now is your chance to let us know!',
  },
  {
    q: 'I am going to be on vacation, can someone else enter my information on the website?',

    a:
      'No, unfortunately, only you can enter your time. While you are on vacation, keep a log of your time and enter it when you return.',
  },
  {
    q: 'Do I have to add team members from within my office/work unit?',

    a:
      'No, teammates can come from anywhere in the province. The team leader can add new team members from the Free Agent Pool or check the message board for those seeking a team. Take this opportunity to include someone you haven\'t met! There may be a solitary marathon runner waiting to be snapped up by your team! If you decide to add from the Free Agent Pool, please inform the person to ensure they are aware. Remember, it\'s about having fun while promoting physical activity.',
  },
  {
    q: 'Can I be on more than one team?',

    a:
      'No - anyone who is already registered on a team cannot be on another team.',
  },
  {
    q: 'Can you have smaller teams (i.e. less than five team members)?',

    a:
      'Yes. You can go with less than five people, although it\'s not recommended as it will take longer to collect fitness points as a team. Alternatively, you can pick names from the Free Agent Pool to add them to your team to make five. Remember, you can be from different parts of the province and still be on the same team.',
  },
  {
    q: 'We have a team member who is unable to continue participating, but has some time logged. Are we able to replace them with another person?',

    a:
      'Yes. You can replace a team member if required. The team leader can delete the leaving member on the Teams page. This action will free a spot on your team and allow the team leader to add a new member from the Free Agent Pool.',
  },  
  {
    q: 'When is the last day to enter my activity?',

    a:
      'Activities must be be entered by 4:30 p.m. three business days following the last day of the event. Try your best to enter your activities daily or at least every week so that your teammates can see your progress. This also helps to keep the overall standings up-to-date.'
  },  
  {
    q: 'What the tole of a team leader?',

    a:
`
Contact your future teammates and unharness your motivational skills to get them to register and join the event so you can "pick them up". Create a unique team profile. Go crazy.
That's it! Once your team is ready, you simply enter your activity each day and monitor your progress. 

Note, once you have created a team you cannot delete it or join another team.
`,
  },  
  {
    q: 'What is the role of a regular team member?',

    a:
      'Decide if you want to be on a team of people you know, or whether you\'d like to be a "free agent". Free agents can get picked up by any team. Either way, you have to register first, once you\'ve done that, contact your leader and tell them to "get me the heck on your team". Your leader, being the highly efficient, motivated coach they are, will immediately "pick you up". Of course, sending a basket of fruit may help speed up this process. Free Agents can get picked up by any Team Leader anywhere in the ministry.',
  },  
];

const faqItems2 = [
  {
    q: 'Why am I experiencing technical difficulties? ',

    a:
      'TransAction Wellness is best used with Microsoft Edge or Google Chrome. You’ll experience technical difficulties if you are using Internet Explorer.',
  },
  {
    q: 'How is TransAction Wellness different from TransAction: Healthy Workplace Challenge? ',

    a:
      'TransAction Wellness is based on participation, so there is no competition for earning the most points between teams. That being said, you can log your activities just like the regular TransAction event, make your own teams, and use the Message Board to talk about your experience, share resources (such as your favourite online workout) and motivate your colleagues.  ',
  },
  {
    q: 'How many people need to be on a team? ',

    a:
      'Since teams won’t be competing with one another during this event, it makes no difference how many people are on a team. You can create your own team and be the sole member, although we encourage people to form teams with their colleagues for mutual support. The maximum number of team members remains five. If you would like to add members to your team, you can pick names from the Free Agent Pool. Remember, you can be from different parts of the province and still be on the same team. ',
  },
  {
    q: 'Can I be on more than one team? ',

    a:
      'No - anyone who is already registered on a team cannot be on another team.',
  },
  {
    q: 'Are there different categories? ',

    a:
      'No. You may have noticed that we’ve eliminated the two different categories of “recreational” and “competitive.”',
  },
  {
    q: 'Will there be prizes? ',

    a:
      'There will be prizes! A random draw will be held each week to reward people just for taking part. Please note that prizes will be delivered to recipients once it is safe to do so. ',
  },
  {
    q: 'How do I log my activity?',

    a:
      'Once you have joined a team, you can enter your activity by clicking on the Events page and then selecting TransAction Wellness. Once selected, click Log Activity.  ',
  },
  {
    q: 'What counts as an activity? ',

    a:
      'Any wellness activity that positively contributes to your health and well-being counts! For example, if you are going for a bike ride, meditating or listening to a self-help podcast, these all count. Part of the purpose of TransAction Wellness is to help folks adopt healthy behaviours which become healthy habits.  ',
  },
  {
    q: 'What if the activity I completed isn’t listed?',

    a:
      'If you completed an activity that is not available in the drop-down list, select “Other,” and then provide a short activity description. This will help us to expand the activity list for next year.  ',
  },
  {
    q: 'When is the last day to enter my activity? ',

    a:
      'Activities must be entered by 4:30 p.m. three business days following the last day of the event. Try your best to enter your activities daily or at least every week so that your teammates can see your progress.  ',
  },
];

class FAQ extends React.Component {
  renderContent = () => {
    return (
      <Row>
        <Col>
          <h4>Frequently Asked Questions</h4><br />
          <h5>TransAction Healthy Workplace Challenge</h5>
          <div className="mt-3">
            {faqItems1.map((item, index) => {
              return (
                <CardWrapper key={index}>
                  <h6>{item.q}</h6>
                  <Markdown allowedTypes={Constants.MARKDOWN.ALLOWED} source={item.a} />
                </CardWrapper>
              );
            })}
          </div>
          <h5>TransAction Wellness</h5>
           <div className="mt-3">
            {faqItems2.map((item, index) => {
              return (
                <CardWrapper key={index}>
                  <h6>{item.q}</h6>
                  <Markdown allowedTypes={Constants.MARKDOWN.ALLOWED} source={item.a} />
                </CardWrapper>
              );
            })}
          </div>
        </Col>
      </Row>
    );
  };
  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment>{[{ active: true, text: 'FAQ' }]}</BreadcrumbFragment>

        <React.Fragment>{this.renderContent()}</React.Fragment>
      </React.Fragment>
    );
  }
}

export default FAQ;
