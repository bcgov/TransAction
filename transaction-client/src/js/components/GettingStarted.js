import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row, Button, Card, CardBody, CardHeader, CardFooter, CardDeck } from 'reactstrap';
import { Link } from 'react-router-dom';

import EditTeamForm from './forms/EditTeamForm';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as Constants from '../Constants';

class GettingStarted extends React.Component {
  state = { showCreateTeamForm: false };

  showCreateTeamForm = () => {
    this.setState({ showCreateTeamForm: true });
  };

  toggleCreateTeamForm = () => {
    this.setState(prevState => ({
      showCreateTeamForm: !prevState.showCreateTeamForm,
    }));
  };

  renderText() {
    return (
      <CardWrapper>
        <Row>
          <Col>
            <h4>How does TransAction work?</h4>
            <p>
              You participate in TransAction by becoming a member of a team. A team is composed of a leader and up to
              four team members. You can join a team of people you know, or make yourself available to join any team in
              the ministry.
            </p>

            <p>
              Teams enter daily activity time in TransAction, and you monitor your team's progress and standings on the
              homepage. You will not only compete against other teams, but your individual time will also help your
              geographic area compete in the 4-way battle between regions and headquarters.
            </p>

            <p>
              Exercise time is entered for each day and points are assigned based on level of intensity. Time entered is
              converted to points. High, medium and low intensity exercises are multiplied by factors of 3, 2, and 1,
              respectively. You can view your activity log entries on the calendar. More information can be found in the{' '}
              <Link to={Constants.PATHS.FAQ}>FAQ</Link> section of this webpage.
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
                Privacy Notice: Your name and email will be collected and stored as a way to identify you and keep track
                of your progress on this site.
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

const mapStateToProps = state => {
  return {
    currentUser: state.users.all[state.users.current.id],
  };
};

export default connect(
  mapStateToProps,
  null
)(GettingStarted);
