import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Row, Col, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TeamProfileFragment from './TeamProfileFragment';

import * as Constants from '../../Constants';

class UserProfileTeamPanel extends React.Component {
  renderUserTeam() {
    const teamToDisplay = this.props.teams[this.props.teamIdToDisplay];
    const userToDisplay = this.props.users.all[this.props.userIdToDisplay];

    return (
      <React.Fragment>
        <Row>
          <Col>
            {(() => {
              if (!teamToDisplay) {
                if (this.props.selfProfile)
                  return (
                    <Alert color="warning">
                      You are not currently on a team. Get started <Link to={Constants.PATHS.START}>here</Link>.
                    </Alert>
                  );
                else return <p>{userToDisplay.fname} is not part of a team.</p>;
              } else
                return (
                  <TeamProfileFragment
                    team={teamToDisplay}
                    regionName={this.props.regions[teamToDisplay.regionId].name}
                    linkToProfile={true}
                    profileLink={`${Constants.PATHS.TEAM}/${teamToDisplay.id}`}
                  />
                );
            })()}
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  renderContent() {
    const { selfProfile } = this.props;
    const teamToDisplay = this.props.teams[this.props.teamIdToDisplay];

    return (
      <React.Fragment>
        <Row className="mb-3">
          <Col xs="2">
            <h4>Team Status</h4>
          </Col>
          <Col className="text-right">
            {selfProfile && teamToDisplay && teamToDisplay.numMembers > 1 && (
              <Button color="danger" size="sm">
                <FontAwesomeIcon icon="sign-out-alt" /> Leave
              </Button>
            )}
          </Col>
        </Row>
        {this.renderUserTeam()}
      </React.Fragment>
    );
  }

  render() {
    return this.renderContent();
  }
}

const mapStateToProps = state => {
  return {
    teams: state.teams,
    users: state.users,
    regions: state.regions,
    currentUser: state.users.current,
  };
};

export default connect(
  mapStateToProps,
  null
)(UserProfileTeamPanel);
