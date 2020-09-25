import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row, Button, Card, CardBody, CardHeader, CardFooter, CardDeck } from 'reactstrap';
import { HashLink as Link } from 'react-router-hash-link';

import EditTeamForm from './forms/EditTeamForm';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as api from '../api/api';
import * as Constants from '../Constants';

class GettingStarted extends React.Component {
  state = { showCreateTeamForm: false };

  componentDidMount() {
    api.resetCancelTokenSource();
  }

  componentWillUnmount() {
    api.cancelRequest();
  }

  showCreateTeamForm = () => {
    this.setState({ showCreateTeamForm: true });
  };

  toggleCreateTeamForm = () => {
    this.setState((prevState) => ({
      showCreateTeamForm: !prevState.showCreateTeamForm,
    }));
  };

  renderText() {
    return (
      <CardWrapper>
        <Row>
          <Col>
            <p>
              <h4>
                <em>How does TransAction Healthy Workplace Challenge work?</em>
              </h4>
            </p>
            <h6>Create or join a team:</h6>
            <p>
              To participate in an event, you can either join a team of people, create a team, or join individually by
              clicking the Get Started button below. If you would like to make yourself available to join any cd team in
              the ministry, click Join Team and then click Become Free Agent. Teams can have a maximum of five members.
            </p>
            There are two categories on the Events page for TransAction Healthy Workplace Challenge:{' '}
            <strong>Competitive</strong> and <strong>Recreational</strong>.<p></p>
            <ul>
              <li>
                If you are competitive by nature and you strive to burn calories daily, you will enter the{' '}
                <strong>Competitive category</strong>.
              </li>
              <li>
                If you are looking to increase your physical activity but prefer a less competitive challenge, then you
                will enter the <strong>Recreational category</strong>.
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
              Recreational. Click on Log Activity to enter your activity in 15-minute increments based on intensity from
              the dropdown list. If your activity isn’t listed, choose the intensity performed (i.e. Low, Medium or
              High) and select “Other.” You will be prompted to provide a short description of the activity performed.
            </p>
            <h6>Prizes:</h6>
            <p>
              Your "fitness points" will be automatically calculated and prizes will be awarded to the top ranking teams
              in both the Competitive and Recreational categories. There will also be a participation prize drawn every
              week so long as you have joined a team, you will be eligible to win!
            </p>
            <p>
              Check out the <Link to={Constants.PATHS.FAQ_HEALTH}>FAQ</Link> for more information!
            </p>
            <p>
              <h4>
                <em>How does TransAction Wellness work?</em>
              </h4>
            </p>
            <p>
              You participate in TransAction Wellness by creating or becoming a member of a team, or participating on
              your own. A team is composed of a leader and up to four team members. You can join a team or make yourself
              available to join any team in the ministry by becoming a Free Agent.
            </p>
            <p>
              Individuals enter daily activity time in TransAction Wellness, and you can monitor your team's progress on
              the homepage. All activities for this event hold the same low intensity level. This is not a competitive
              event. It is a tool to help encourage you to make healthy choices.
            </p>
            <p>You can view your activity log entries on the calendar.</p>
            <p>
              Check out the <Link to={Constants.PATHS.FAQ_WELLNESS}>FAQ</Link> for more information!
            </p>
          </Col>
        </Row>
        {!this.props.currentUser.teamId ? (
          <Row className="mt-5">
            <Col>
              <CardDeck>
                <Card>
                  <CardHeader>
                    <h5>Team Leader</h5>
                  </CardHeader>
                  <CardBody>
                    <p>
                      Contact your future teammates and unharness your motivational skills to get them to register and
                      join the selection pool (see "Regular Team Members" below). Then Register yourself and go to Team
                      Information, where you can name and pick your team mates from the selection pool. Contact your
                      potential team members so you can "pick them up" as soon as they register. Create a unique team
                      profile. Go crazy.
                    </p>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button color="primary" onClick={this.showCreateTeamForm}>
                      Create Team
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <h5>Team Member</h5>
                  </CardHeader>
                  <CardBody>
                    <p>
                      Decide if you want to be on a team of people you know, or whether you'd like to be a "free agent".
                      Free agents can get picked up by any team. Either way, you have to Register first, then join the
                      Selection Pool. Once you've done that, contact your leader and tell them to "get me the heck on
                      your team". Your leader, being the highly efficient, motivated coach they are, will immediately
                      "pick you up". Of course, sending a basket of fruit may help speed up this process. Free Agents
                      can get picked up by any Team Leader anywhere in the ministry.
                    </p>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Link to={Constants.PATHS.TEAM}>
                      <Button color="primary">Join Team</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </CardDeck>
              <Alert color="primary" className="mt-5">
                <p>
                  <strong>Privacy Notice:</strong> The personal information is collected by the Ministry of
                  Transportation and Infrastructure under s.26( c) of the Freedom of Information and Protection of
                  Privacy Act ("FOIPPA") for the purposes of enabling ministry employees to participate in TransAction.
                </p>
                <p>
                  Should you have any questions about the collection of this personal information, please contact:
                  <br />
                  Manager, Workforce Programs,
                  <br />
                  Strategic HR Suite 5A - 940 Blanshard Street,
                  <br />
                  Victoria BC, VSW 9T5
                  <br />
                  778-678-4691
                </p>
              </Alert>
            </Col>
          </Row>
        ) : (
          <Alert color="warning">
            You are already on a team. Please head to the <Link to={Constants.PATHS.EVENT}>Events</Link> page to
            participate in an event.
          </Alert>
        )}
      </CardWrapper>
    );
  }

  render() {
    return (
      <React.Fragment>
        <BreadcrumbFragment>{[{ active: true, text: 'Getting Started' }]}</BreadcrumbFragment>
        {this.renderText()}
        {this.state.showCreateTeamForm && (
          <EditTeamForm
            isOpen={this.state.showCreateTeamForm}
            toggle={this.toggleCreateTeamForm}
            initialValues={{ goal: 0 }}
            formType={Constants.FORM_TYPE.ADD}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.users.all[state.users.current.id],
  };
};

export default connect(mapStateToProps, null)(GettingStarted);
