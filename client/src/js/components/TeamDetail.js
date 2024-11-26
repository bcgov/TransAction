import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { fetchCurrentUser, fetchTeam, editTeam, fetchUser, fetchSpecificTeamRequests, editUser } from '../actions';
import PageSpinner from './ui/PageSpinner';
import TeamProfileFragment from './fragments/TeamProfileFragment';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import TeamJoinRequestPanel from './fragments/TeamJoinRequestPanel';
import TeamMembersPanel from './fragments/TeamMembersPanel';
import ProfileScoresPanel from './fragments/ProfileScoresPanel';
import CardWrapper from './ui/CardWrapper';
import * as api from '../api/api';
import * as utils from '../utils';
import * as Constants from '../Constants';

const Team = ({
  fetchTeam,
  fetchUser,
  fetchCurrentUser,
  users,
  teams,
  regions,
  currentUser
}) => {
  const [loading, setLoading] = useState(true);
  const [teamIdToDisplay, setTeamIdToDisplay] = useState(null);

  const { id } = useParams(); // Use useParams to get the ID from the route

  useEffect(() => {
    api.resetCancelTokenSource();
    init(id);

    return () => {
      api.cancelRequest();
    };
  }, [id]);

  const init = useCallback((teamId) => {
    setLoading(true);
    const parsedTeamId = parseInt(teamId);

    fetchTeam(parsedTeamId)
      .then(() => {
        const team = teams[parsedTeamId];
        if (team) setTeamIdToDisplay(team.id);

        const usersToFetch = team.teamMemberIds.filter(userId => !(userId in users));
        
        // console.log('parsedTeamId:', parsedTeamId);
        // console.log('teams:', teams);

        return Promise.all(
          usersToFetch.map(user => fetchUser(user))
        );
      })
      .then(() => setLoading(false));
  }, [fetchTeam, fetchUser, users, teams]);

  const userIsTeamleadOrAdmin = () => {
    const team = teams[teamIdToDisplay];
    if (!team) return false;
    return utils.isCurrentUserAdmin() || team.teamLeaderId === currentUser.id;
  };

  const userIsTeamlead = () => {
    const team = teams[teamIdToDisplay];
    if (!team) return false;
    return team.teamLeaderId === currentUser.id;
  };

  const userBelongsToTeam = () => {
    if (!currentUser.teamId) return false;
    return teamIdToDisplay === currentUser.teamId;
  };

  const teamToDisplay = teams[teamIdToDisplay];
  const breadCrumbItems = [
    { active: false, text: 'Teams', link: Constants.PATHS.TEAM }
  ];
  if (teamToDisplay) breadCrumbItems.push({ active: true, text: teamToDisplay.name });

  return (
    <React.Fragment>
      <BreadcrumbFragment>{breadCrumbItems}</BreadcrumbFragment>

      <CardWrapper>
        {loading ? (
          <PageSpinner />
        ) : (
          <TeamProfileFragment
            canEdit={userIsTeamleadOrAdmin()}
            team={teamToDisplay}
            regionName={regions[teamToDisplay.regionId]?.name}
          />
        )}
      </CardWrapper>

      <CardWrapper>
        <Row className="mb-3">
          <Col>
            <h4>Team Members</h4>
          </Col>
        </Row>
        {loading ? (
          <PageSpinner />
        ) : (
          <TeamMembersPanel
            teamToDisplay={teamToDisplay}
            users={users}
            regions={regions}
            currentUser={currentUser}
          />
        )}
      </CardWrapper>

      {teamToDisplay && userIsTeamlead() && teamToDisplay.numMembers < 5 && (
        <TeamJoinRequestPanel team={teamToDisplay} />
      )}

      {userBelongsToTeam() && teamToDisplay && (
        <CardWrapper>
          <ProfileScoresPanel
            userIdToDisplay={currentUser.id}
            teamIdToDisplay={teamIdToDisplay}
          />
        </CardWrapper>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.users.all[state.users.current.id],
  scores: state.scores,
  teams: state.teams,
  users: state.users.all,
  roles: state.roles,
  joinRequests: Object.values(state.joinRequests),
  regions: state.regions,
  events: state.events,
});

export default connect(
  mapStateToProps,
  { fetchCurrentUser, fetchTeam, editTeam, fetchUser, fetchSpecificTeamRequests, editUser }
)(Team);
