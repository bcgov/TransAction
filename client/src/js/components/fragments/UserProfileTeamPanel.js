import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Alert } from 'reactstrap';

import TeamProfileFragment from './TeamProfileFragment';
import * as Constants from '../../Constants';

const UserProfileTeamPanel = ({ teamIdToDisplay, userIdToDisplay, selfProfile }) => {
  const teams = useSelector((state) => state.teams);
  const users = useSelector((state) => state.users);
  const regions = useSelector((state) => state.regions);

  const teamToDisplay = teams[teamIdToDisplay];
  const userToDisplay = users.all[userIdToDisplay];

  const renderUserTeam = () => {
    if (!teamToDisplay) {
      return (
        <Row>
          <Col>
            {selfProfile ? (
              <Alert color="warning">
                You are not currently on a team. Get started <Link to={Constants.PATHS.START}>here</Link>.
              </Alert>
            ) : (
              <p>{userToDisplay.fname} is not part of a team.</p>
            )}
          </Col>
        </Row>
      );
    }

    return (
      <Row>
        <Col>
          <TeamProfileFragment
            team={teamToDisplay}
            regionName={regions[teamToDisplay.regionId]?.name}
            linkToProfile={true}
            profileLink={`${Constants.PATHS.TEAM}/${teamToDisplay.id}`}
          />
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          <h4>Team Status</h4>
        </Col>
      </Row>
      {renderUserTeam()}
    </>
  );
};

export default UserProfileTeamPanel;
