import React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, FormGroup, Input, Label, Table } from 'reactstrap';
import _ from 'lodash';

import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import { fetchUsers, editUserRole, fetchAdminUsers } from '../actions';
import DialogModal from './ui/DialogModal';

import * as utils from '../utils';
// import * as Constants from '../Constants';

class Admin extends React.Component {
  state = { toggleActive: {}, showConfirmDialog: false, confirmDialogOptions: {}, userFilter: '' };

  componentDidMount() {
    //this.props.fetchUsers();
    this.props.fetchAdminUsers();
  }

  handleRoleIdChanged = (confirm, roleId, userId) => {
    if (confirm) {
      this.props.editUserRole(userId, roleId).then(() => this.closeConfirmDialog());
    } else {
      this.closeConfirmDialog();
      window.location.reload();
    }
  };

  confirmRoleChange = (roleId, userId) => {
    this.setState({
      showConfirmDialog: true,
      confirmDialogOptions: {
        title: 'Change User Role?',
        body: "The use's role will be changed.",
        secondary: true,
        callback: confirm => this.handleRoleIdChanged(confirm, roleId, userId),
      },
    });
  };

  closeConfirmDialog() {
    this.setState({ showConfirmDialog: false, confirmDialogOptions: {}, clicked: false });
  }

  handleUserFilterChnaged = e => {
    this.setState({ userFilter: e.target.value });

    const value = e.target.value.trim();
    if (value !== '') this.props.fetchUsers(e.target.value.trim());
  };

  renderUserSearch() {
    const userFilter = this.state.userFilter.trim().toUpperCase();
    let filteredUsers = [];

    if (this.state.userFilter.trim() !== '')
      filteredUsers = _.filter(Object.values(this.props.users), u => {
        return `${u.fname.toUpperCase()} ${u.lname.toUpperCase()}`.includes(userFilter);
      });

    const userList = this.buildUserList(filteredUsers);

    return (
      <React.Fragment>
        <FormGroup row>
          <Label for="userFilter" sm={2}>
            User Search
          </Label>
          <Col sm={10}>
            <Input
              type="text"
              id="userFilter"
              placeholder="Search by first name or last name"
              bsSize="sm"
              value={this.state.userFilter}
              onChange={this.handleUserFilterChnaged}
            />
          </Col>
        </FormGroup>

        {userList.length > 0 ? (
          this.renderUserTable(userList)
        ) : this.state.userFilter.trim() !== '' ? (
          <Alert color="warning">No users found with that search criteria.</Alert>
        ) : (
          <Alert color="primary">Start a search using the field above</Alert>
        )}
      </React.Fragment>
    );
  }

  renderExistingAdmins() {
    const filteredUsers = _.filter(Object.values(this.props.users), u => {
      return u.roleId === 1;
    });

    const userList = this.buildUserList(filteredUsers);

    return this.renderUserTable(userList);
  }

  buildUserList(inputUserList) {
    const roleOptions = Object.values(this.props.roles).map(role => (
      <option key={role.id} value={role.id}>
        {role.name.toUpperCase()}
      </option>
    ));

    return _.orderBy(inputUserList, ['fname', 'lname']).map(user => {
      return (
        <tr key={user.id}>
          <td>{`${user.fname} ${user.lname}`}</td>
          <td>
            <Input
              type="select"
              bsSize="sm"
              defaultValue={user.roleId}
              onChange={e => this.confirmRoleChange(e.target.value, user.id)}
            >
              {roleOptions}
            </Input>
          </td>
        </tr>
      );
    });
  }

  renderUserTable(userList) {
    return (
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
  }

  render() {
    return (
      <React.Fragment>
        {utils.isCurrentUserAdmin() ? (
          <React.Fragment>
            <BreadcrumbFragment>{[{ active: true, text: 'Admin' }]}</BreadcrumbFragment>

            <CardWrapper>
              <h4>Site Admins</h4>
              {this.renderExistingAdmins()}
            </CardWrapper>

            <CardWrapper>
              <h4>Add New Admin</h4>
              {this.renderUserSearch()}
            </CardWrapper>

            {this.state.showConfirmDialog && (
              <DialogModal isOpen={this.state.showConfirmDialog} options={this.state.confirmDialogOptions} />
            )}
          </React.Fragment>
        ) : (
          <p>Hey you shouldn't be here...</p>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.all[state.users.current.id],
    users: state.users.all,
    roles: state.roles,
  };
};

export default connect(
  mapStateToProps,
  { fetchUsers, editUserRole, fetchAdminUsers }
)(Admin);
