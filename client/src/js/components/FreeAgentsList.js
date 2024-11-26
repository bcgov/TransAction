import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Table } from 'reactstrap';

import { fetchUsers, fetchTeam, addUserToTeam, fetchUser } from '../actions';
import PageSpinner from './ui/PageSpinner';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import DialogModal from './ui/DialogModal';

import * as api from '../api/api';
import * as utils from '../utils';

const FreeAgentsList = ({
  fetchUsers,
  fetchTeam,
  addUserToTeam,
  fetchUser,
  teams,
  currentUser,
  regions,
  users
}) => {
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogOptions, setConfirmDialogOptions] = useState({});

  useEffect(() => {
    api.resetCancelTokenSource();
    const loadData = async () => {
      await fetchUsers();
      if (currentUser.teamId && !teams[currentUser.teamId]) {
        await fetchTeam(currentUser.teamId);
      }
      setLoading(false);
    };
    loadData();

    return () => {
      api.cancelRequest();
    };
  }, [fetchUsers, fetchTeam, currentUser, teams]);

  const handleRecruitUser = (confirm, userId) => {
    if (confirm) {
      const team = teams[currentUser.teamId];
      addUserToTeam({ userId, teamId: team.id })
        .then(() => Promise.all([fetchUser(userId), fetchTeam[team.id]]))
        .finally(() => closeConfirmDialog());
    } else {
      closeConfirmDialog();
    }
  };

  const confirmRecruitUser = (userId, userName) => {
    setConfirmDialogOptions({
      title: 'Recruit Member?',
      body: `${userName} will be joining your team.`,
      secondary: true,
      callback: confirm => handleRecruitUser(confirm, userId),
    });
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setConfirmDialogOptions({});
  };

  const renderContent = () => {
    const freeagentUsers = Object.values(users).filter(
      user => user.isFreeAgent && !user.teamId
    );

    if (freeagentUsers.length === 0) {
      return <Alert color="primary">There are no free agents at the moment.</Alert>;
    }

    const userRows = freeagentUsers.map(user => (
      <tr key={user.id}>
        <td>{user.fname}</td>
        <td>{user.lname}</td>
        <td>{regions[user.regionId].name}</td>

        {utils.isCurrentUserTeamlead() && (
          <td>
            <Button
              color="primary"
              size="sm"
              onClick={() => confirmRecruitUser(user.id, `${user.fname} ${user.lname}`)}
            >
              Recruit
            </Button>
          </td>
        )}
      </tr>
    ));

    return (
      <Table size="sm" hover bordered responsive className="mt-3">
        <thead className="thead-dark">
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Region</th>
            {utils.isCurrentUserTeamlead() && <th />}
          </tr>
        </thead>
        <tbody>{userRows}</tbody>
      </Table>
    );
  };

  return (
    <>
      <BreadcrumbFragment>{[{ active: true, text: 'Free Agents' }]}</BreadcrumbFragment>
      <CardWrapper>
        <h4>Free Agents</h4>
        <p>
          Team leaders can recruit from TransAction <em>Free Agents</em> below.
        </p>
        {loading ? <PageSpinner /> : renderContent()}
      </CardWrapper>
      {showConfirmDialog && (
        <DialogModal isOpen={showConfirmDialog} options={confirmDialogOptions} />
      )}
    </>
  );
};

const mapStateToProps = state => ({
  users: state.users.all,
  teams: state.teams,
  currentUser: state.users.all[state.users.current.id],
  regions: state.regions,
});

export default connect(mapStateToProps, { fetchUsers, fetchTeam, addUserToTeam, fetchUser })(
  FreeAgentsList
);
