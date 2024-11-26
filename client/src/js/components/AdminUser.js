import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Alert, Row, Col, Input, Table } from 'reactstrap';
import _ from 'lodash';

import CardWrapper from './ui/CardWrapper';
import { fetchUsers, editUserRole, fetchAdminUsers } from '../actions';
import DialogModal from './ui/DialogModal';

import * as api from '../api/api';

const AdminUser = ({ users, roles, fetchUsers, fetchAdminUsers, editUserRole }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogOptions, setConfirmDialogOptions] = useState({});
  const [userSearchTerm, setUserSearchTerm] = useState('');

  useEffect(() => {
    api.resetCancelTokenSource();
    fetchAdminUsers();
    return () => {
      api.cancelRequest();
    };
  }, [fetchAdminUsers]);

  const handleRoleIdChanged = (confirm, roleId, userId) => {
    if (confirm) {
      editUserRole(userId, roleId).finally(() => closeConfirmDialog());
    } else {
      closeConfirmDialog();
      window.location.reload();
    }
  };

  const confirmRoleChange = (roleId, userId) => {
    setShowConfirmDialog(true);
    setConfirmDialogOptions({
      title: 'Change User Role?',
      body: "The user's role will be changed.",
      secondary: true,
      callback: (confirm) => handleRoleIdChanged(confirm, roleId, userId),
    });
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setConfirmDialogOptions({});
  };

  const handleUserSearchTermChanged = (e) => {
    const value = e.target.value.trim();
    setUserSearchTerm(value);

    if (value !== '') fetchUsers(value);
  };

  const renderUserSearch = () => {
    const userSearchTermUpper = userSearchTerm.trim().toUpperCase();
    let filteredUsers = [];

    if (userSearchTerm.trim() !== '')
      filteredUsers = _.filter(Object.values(users), (u) => {
        return `${u.fname.toUpperCase()} ${u.lname.toUpperCase()}`.includes(userSearchTermUpper);
      });

    const userList = buildUserList(filteredUsers);

    return (
      <React.Fragment>
        <Row className="mb-3">
          <Col sm={0} md={6} />
          <Col sm={12} md={6}>
            <Input
              type="text"
              id="userSearchTerm"
              placeholder="Search by first name or last name"
              bsSize="sm"
              value={userSearchTerm}
              onChange={handleUserSearchTermChanged}
            />
          </Col>
        </Row>

        {userList.length > 0 ? (
          renderUserTable(userList)
        ) : userSearchTerm.trim() !== '' ? (
          <Alert color="warning">No users found with that search criteria.</Alert>
        ) : (
          <Alert color="primary">Start a search using the field above</Alert>
        )}
      </React.Fragment>
    );
  };

  const renderExistingAdmins = () => {
    const filteredUsers = _.filter(Object.values(users), (u) => u.roleId === 1);
    const userList = buildUserList(filteredUsers);
    return renderUserTable(userList);
  };

  const buildUserList = (inputUserList) => {
    const roleOptions = Object.values(roles).map((role) => (
      <option key={role.id} value={role.id}>
        {role.name.toUpperCase()}
      </option>
    ));

    return _.orderBy(inputUserList, ['fname', 'lname']).map((user) => (
      <tr key={user.id}>
        <td>{`${user.fname} ${user.lname}`}</td>
        <td>
          <Input
            type="select"
            bsSize="sm"
            defaultValue={user.roleId}
            onChange={(e) => confirmRoleChange(e.target.value, user.id)}
          >
            {roleOptions}
          </Input>
        </td>
      </tr>
    ));
  };

  const renderUserTable = (userList) => (
    <Table size="sm" bordered>
      <thead className="thead-dark">
        <tr>
          <th>User</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>{userList}</tbody>
    </Table>
  );

  return (
    <React.Fragment>
      <CardWrapper>
        <h4>Site Administrator Management</h4>
        {renderExistingAdmins()}
      </CardWrapper>

      <CardWrapper>
        <h4>Add New Admin</h4>
        {renderUserSearch()}
      </CardWrapper>

      {showConfirmDialog && <DialogModal isOpen={showConfirmDialog} options={confirmDialogOptions} />}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.users.all[state.users.current.id],
  users: state.users.all,
  roles: state.roles,
});

export default connect(mapStateToProps, { fetchUsers, editUserRole, fetchAdminUsers })(AdminUser);
