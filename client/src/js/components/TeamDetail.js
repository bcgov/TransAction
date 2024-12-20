import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { useParams } from 'react-router-dom';

import { fetchCurrentUser, fetchTeam, editTeam, fetchUser, editUser, fetchSpecificTeamRequests } from '../actions';
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

const Team = ({ fetchTeam, fetchUser, currentUser, teams, regions, users }) => {
  const { id } = useParams(); // Extract the `id` param using `useParams`
  const [loading, setLoading] = useState(true);
  const [teamIdToDisplay, setTeamIdToDisplay] = useState(null);

  useEffect(() => {
    api.resetCancelTokenSource();
    init(id); // Using the `id` param
    return () => api.cancelRequest();
  }, [id]); // Watch for changes in the `id` param

  const init = async (teamId) => {
    setLoading(true);
    teamId = parseInt(teamId);

    try {
      await fetchTeam(teamId);
      const team = teams[teamId];
      if (team) setTeamIdToDisplay(team.id);

      let usersToFetch = team.teamMemberIds.filter(userId => !(userId in users));
      await Promise.all(usersToFetch.map(user => fetchUser(user)));
    } catch (error) {
      console.error('Failed to fetch team data', error);
    } finally {
      setLoading(false);
    }
  };

  const userIsTeamleadOrAdmin = () => {
    const team = teams[teamIdToDisplay];
    return team && (utils.isCurrentUserAdmin() || team.teamLeaderId === currentUser.id);
  };

  const userIsTeamlead = () => {
    const team = teams[teamIdToDisplay];
    return team && team.teamLeaderId === currentUser.id;
  };

  const userBelongsToTeam = () => {
    if (!currentUser.teamId) return false;
    return teamIdToDisplay === currentUser.teamId;
  };

  const teamToDisplay = teams[teamIdToDisplay];
  console.log(teamToDisplay);

  const breadCrumbItems = [{ active: false, text: 'Teams', link: Constants.PATHS.TEAM }];
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

const mapStateToProps = state => ({
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
