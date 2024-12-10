import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchTeam, editUser, fetchUser } from '../actions';
import PageSpinner from './ui/PageSpinner';
import UserProfileFragment from './fragments/UserProfileFragment';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import ProfileScoresPanel from './fragments/ProfileScoresPanel';
import UserProfileTeamPanel from './fragments/UserProfileTeamPanel';
import CardWrapper from './ui/CardWrapper';

import * as api from '../api/api';
import * as utils from '../utils';
import * as Constants from '../Constants';

const Profile = ({ currentUser, fetchUser, fetchTeam, users, regions, teams }) => {
  const [loading, setLoading] = useState(true);
  const [userIdToDisplay, setUserIdToDisplay] = useState(null);
  const [teamIdToDisplay, setTeamIdToDisplay] = useState(null);
  
  const { id } = useParams(); // Get the user id from URL params

  useEffect(() => {
    api.resetCancelTokenSource();
    init(id);

    return () => {
      api.cancelRequest();
    };
  }, [id]); // Re-run when user id changes

  const init = (userId) => {
    setLoading(true);
    let userIdToUse = parseInt(userId);

    if (isNaN(userIdToUse)) userIdToUse = currentUser.id;
    fetchUser(userIdToUse)
      .then(() => {
        const teamId = users.all[userIdToUse].teamId;
        setUserIdToDisplay(userIdToUse);
        setTeamIdToDisplay(teamId);

        if (teamId) return fetchTeam(teamId);
        else return Promise.resolve();
      })
      .then(() => {
        setLoading(false);
      });
  };

  const userCanEditProfile = () => {
    if (utils.isCurrentUserAdmin()) return true;
    return selfProfile();
  };

  const selfProfile = () => {
    const userId = parseInt(id);

    if (!userId) return true;
    if (userId === currentUser.id) return true;

    return false;
  };


  const userToDisplay = users.all[userIdToDisplay];
  const breadCrumbItems = [{ active: false, text: 'Profile', link: Constants.PATHS.TEAM }];
  if (userToDisplay) breadCrumbItems.push({ active: true, text: `${userToDisplay.fname} ${userToDisplay.lname}` });

  return (
    <>
      <BreadcrumbFragment>{breadCrumbItems}</BreadcrumbFragment>

      <CardWrapper>
        {loading ? (
          <PageSpinner />
        ) : (
          userToDisplay && (
            <UserProfileFragment
              canEdit={userCanEditProfile()}
              userToDisplay={userToDisplay}
              regionName={regions[userToDisplay.regionId].name}
            />
          )
        )}
      </CardWrapper>

      {!loading && (
        <CardWrapper>
          <UserProfileTeamPanel
            selfProfile={selfProfile()}
            teamIdToDisplay={teamIdToDisplay}
            userIdToDisplay={userIdToDisplay}
          />
        </CardWrapper>
      )}

      {!loading && selfProfile() && (
        <CardWrapper>
          <ProfileScoresPanel
            userIdToDisplay={userIdToDisplay}
            teamIdToDisplay={teamIdToDisplay}
          />
        </CardWrapper>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.users.all[state.users.current.id],
    users: state.users,
    regions: state.regions,
    roles: state.roles,
    teams: state.teams,
    events: state.events,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchUser,
    fetchTeam,
    editUser,
  }
)(Profile);
