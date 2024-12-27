import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { rejectJoinRequest, addUserToTeam, fetchUser, fetchSpecificTeamRequests } from '../../actions';
import TeamMemberRow from './TeamMemberRow';
import CardWrapper from '../ui/CardWrapper';
import OneClickButton from '../ui/OneClickButton';
import DialogModal from '../ui/DialogModal';

const TeamJoinRequestPanel = ({ team, fetchSpecificTeamRequests, joinRequests, fetchUser, addUserToTeam, rejectJoinRequest, users, regions }) => {
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogOptions, setConfirmDialogOptions] = useState({});

  useEffect(() => {
    setLoading(true);

    fetchSpecificTeamRequests(team.id)
      .then(() => {
        const usersToFetch = joinRequests.map(request => request.userId);

        return Promise.all(usersToFetch.map(user => fetchUser(user)));
      })
      .then(() => {
        setLoading(false);
      });
  }, [team.id, fetchSpecificTeamRequests, fetchUser]);

  const closeConfirmDialog = useCallback(() => {
    setShowConfirmDialog(false);
    setConfirmDialogOptions({});
  }, []);

  const acceptRequest = useCallback((confirm, request) => {
    if (confirm) {
      addUserToTeam(request)
        .then(() => fetchUser(request.userId))
        .finally(() => closeConfirmDialog());
    }
  }, [addUserToTeam, fetchUser, closeConfirmDialog]);

  const rejectRequest = useCallback((confirm, request) => {
    if (confirm) {
      rejectJoinRequest(request).finally(() => closeConfirmDialog());
    } else {
      closeConfirmDialog();
    }
  }, [rejectJoinRequest, closeConfirmDialog]);

  const confirmAcceptRequest = useCallback(request => {
    setShowConfirmDialog(true);
    setConfirmDialogOptions({
      title: 'Accept Request?',
      body: 'The user will become part of your team.',
      secondary: true,
      callback: confirm => acceptRequest(confirm, request),
    });
  }, [acceptRequest]);

  const confirmRejectRequest = useCallback(request => {
    setShowConfirmDialog(true);
    setConfirmDialogOptions({
      title: 'Reject Request?',
      body: 'The user will not become part of your team.',
      secondary: true,
      callback: confirm => rejectRequest(confirm, request),
    });
  }, [rejectRequest]);

  const renderContent = () => {
    const teamMemberElements = joinRequests.map(joinRequest => {
      const user = users[joinRequest.userId];

      return (
        <TeamMemberRow key={user.id} user={user} regions={regions}>
          <React.Fragment>
            <OneClickButton
              color="success"
              size="sm"
              className="w75 mr-1"
              handleOnClick={() => confirmAcceptRequest(joinRequest)}
            >
              Accept
            </OneClickButton>
            <OneClickButton
              color="danger"
              size="sm"
              className="w75"
              handleOnClick={() => confirmRejectRequest(joinRequest)}
            >
              Reject
            </OneClickButton>
          </React.Fragment>
        </TeamMemberRow>
      );
    });

    return (
      joinRequests.length > 0 &&
      team.numMembers < 5 && (
        <CardWrapper>
          <Row className="mb-3">
            <Col>
              <h4>Team Join Requests</h4>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs="6" lg="4">
              <strong>Name</strong>
            </Col>
            <Col xs="3" lg="4">
              <strong>Region</strong>
            </Col>
            <Col xs="3" lg="4" />
          </Row>
          {teamMemberElements}
          {showConfirmDialog && (
            <DialogModal isOpen={showConfirmDialog} options={confirmDialogOptions} />
          )}
        </CardWrapper>
      )
    );
  };

  return !loading && renderContent();
};

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users.all,
    regions: state.regions,
    currentUser: state.users.all[state.users.current.id],
    joinRequests: Object.values(state.joinRequests).filter(request => request.teamId === ownProps.team.id),
  };
};

export default connect(
  mapStateToProps,
  { rejectJoinRequest, addUserToTeam, fetchUser, fetchSpecificTeamRequests }
)(TeamJoinRequestPanel);