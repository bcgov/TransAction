import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Row, Col, Input, Table, Button } from 'reactstrap';
import _ from 'lodash';

import {
  fetchTeams,
  fetchCurrentTeam,
  editUser,
  createJoinRequest,
  fetchJoinRequests,
} from '../actions';

import PageSpinner from './ui/PageSpinner';
import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import DialogModal from './ui/DialogModal';
import ScrollLoader from './fragments/ScollLoader';

import * as api from '../api/api';
import * as Constants from '../Constants';

const TeamsList = () => {
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogOptions, setConfirmDialogOptions] = useState({});
  const [searchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(15);
  const [pageCount, setPageCount] = useState(1);
  const [teamSearchTerm, setTeamSearchTerm] = useState('');

  const dispatch = useDispatch();

  const {
    teams,
    regions,
    currentUser,
    joinRequests,
  } = useSelector((state) => ({
    teams: state.teams,
    users: state.users.all,
    regions: state.regions,
    currentUser: state.users.all[state.users.current.id],
    joinRequests: Object.values(state.joinRequests),
  }));

  useEffect(() => {
    api.resetCancelTokenSource();

    if (currentUser?.teamId && !teams[currentUser.teamId]) {
      dispatch(fetchCurrentTeam());
    }

    dispatch(fetchJoinRequests());
    loadData();

    return () => {
      api.cancelRequest();
    };
  }, [dispatch]);

  const loadData = () => {
    const nextPage = page + 1;
    if (page < pageCount) {
      dispatch(fetchTeams(searchTerm, nextPage, pageSize)).then((newPageCount) => {
        setLoading(false);
        setPage(nextPage);
        setPageCount(newPageCount);
      });
    }
  };

  const sendJoinRequest = (confirm, userId, teamId) => {
    if (confirm) {
      dispatch(createJoinRequest({ userId, teamId })).finally(() => closeConfirmDialog());
    } else {
      closeConfirmDialog();
    }
  };

  const confirmJoin = (userId, teamId) => {
    setShowConfirmDialog(true);
    setConfirmDialogOptions({
      title: 'Send Join Request?',
      body: 'This team leader will receive your join request.',
      secondary: true,
      callback: (confirm) => sendJoinRequest(confirm, userId, teamId),
    });
  };

  const becomeFreeagent = (confirm) => {
    if (confirm) {
      const userObj = { ...currentUser, isFreeAgent: true };
      dispatch(editUser(userObj.id, userObj)).finally(() => closeConfirmDialog());
    } else {
      closeConfirmDialog();
    }
  };

  const confirmBecomeFreeagent = () => {
    setShowConfirmDialog(true);
    setConfirmDialogOptions({
      title: 'Become a Free Agent?',
      body:
        'Becoming a free agent will allow any team with extra room on its roster to recruit you as its new member.',
      secondary: true,
      callback: (confirm) => becomeFreeagent(confirm),
    });
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setConfirmDialogOptions({});
  };

  const renderTeamRows = () => {
    const userRequests = joinRequests
      .filter((request) => request.userId === currentUser.id)
      .map((request) => request.teamId);

    const searchTermUpper = teamSearchTerm.trim().toUpperCase();
    let filteredTeams = Object.values(teams);

    if (teamSearchTerm.trim() !== '') {
      filteredTeams = _.filter(filteredTeams, (t) => t.name.toUpperCase().includes(searchTermUpper));
    }

    return _.orderBy(filteredTeams, (user) => user.name.toLowerCase()).map((team) => (
      <tr key={team.id}>
        <td>
          <Link className="text-decoration-none" to={`${Constants.PATHS.TEAM}/${team.id}`}>
            {team.name}
          </Link>
        </td>
        <td>{team.teamLeaderName}</td>
        <td>{regions[team.regionId].name}</td>
        <td>{team.numMembers}</td>
        {!currentUser.teamId && (
          <td className="fit">
            {!userRequests.includes(team.id) && (
              <Button size="sm" color="primary" onClick={() => confirmJoin(currentUser.id, team.id)}>
                Request to Join
              </Button>
            )}
          </td>
        )}
      </tr>
    ));
  };

  const handleTeamSearchTermChanged = (e) => {
    setTeamSearchTerm(e.target.value);
    const value = e.target.value.trim();
    if (value !== '') dispatch(fetchTeams(value));
  };

  const renderTeamList = () => {
    const teamRows = renderTeamRows();

    return (
      <>
        <h4 className="mb-3">All TransAction Teams</h4>
        {!currentUser.teamId && !currentUser.isFreeAgent && (
          <div className="mb-3 text-right">
            <Button size="sm" color="primary" onClick={confirmBecomeFreeagent}>
              Become Free Agent
            </Button>
          </div>
        )}
        <Row className="mb-3">
          <Col sm={0} md={6} />
          <Col sm={12} md={6}>
            <Input
              type="text"
              id="teamSearchTerm"
              placeholder="Search by team name"
              bsSize="sm"
              value={teamSearchTerm}
              onChange={handleTeamSearchTermChanged}
            />
          </Col>
        </Row>
        {teamRows.length > 0 ? (
          <ScrollLoader
            loader={loadData}
            page={page}
            pageCount={pageCount}
            shouldLoad={teamSearchTerm.trim() === ''}
          >
            <Table size="sm" hover bordered responsive>
              <thead className="thead-dark">
                <tr>
                  <th>Team Name</th>
                  <th>Team Leader</th>
                  <th>Region</th>
                  <th>Members</th>
                  {!currentUser.teamId && <th className="fit" />}
                </tr>
              </thead>
              <tbody>{teamRows}</tbody>
            </Table>
          </ScrollLoader>
        ) : (
          <Alert color="primary">There are no teams at the moment.</Alert>
        )}
        {showConfirmDialog && <DialogModal isOpen={showConfirmDialog} options={confirmDialogOptions} />}
      </>
    );
  };

  const renderTeamProfile = () => {
    if (currentUser.teamId) {
      return (
        <div>
          {teams[currentUser.teamId] && (
            <Link
              to={`${Constants.PATHS.TEAM}/${currentUser.teamId}`}
              className="text-decoration-none"
              style={{ fontSize: '2rem', fontWeight: '900' }}
            >
              {teams[currentUser.teamId].name} <Button color="primary">View</Button>
            </Link>
          )}
        </div>
      );
    } else {
      return (
        <p>
          You are not on a team. <Link to={Constants.PATHS.START}>Get started</Link> or join one of the teams below!
        </p>
      );
    }
  };

  const renderContent = () => (
    <>
      <CardWrapper>
        <Row>
          <Col>{renderTeamProfile()}</Col>
        </Row>
      </CardWrapper>
      <CardWrapper>
        <Row>
          <Col>{renderTeamList()}</Col>
        </Row>
      </CardWrapper>
    </>
  );

  return (
    <>
      <BreadcrumbFragment>{[{ active: true, text: 'Teams' }]}</BreadcrumbFragment>
      {loading ? <PageSpinner /> : renderContent()}
    </>
  );
};

export default TeamsList;
