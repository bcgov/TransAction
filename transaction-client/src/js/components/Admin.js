import React from 'react';
import { connect } from 'react-redux';
import { Input, Table } from 'reactstrap';
import _ from 'lodash';

import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import { fetchUsers, editUserRole } from '../actions';
import DialogModal from './ui/DialogModal';

import * as utils from '../utils';
// import * as Constants from '../Constants';

class Admin extends React.Component {
  state = { toggleActive: {}, showConfirmDialog: false, confirmDialogOptions: {} };

  componentDidMount() {
    this.props.fetchUsers();
  }

  handleRoleIdChanged = (confirm, roleId, userId) => {
    if (confirm) {
      this.props.editUserRole({ roleId, userId }).then(() => this.closeConfirmDialog());
    } else {
      this.closeConfirmDialog();
      window.location.reload();
    }
  };

  confirmRoleChange = (roleId, userId) => {
    this.setState({
      showConfirmDialog: true,
      confirmDialogOptions: {
        title: 'Change User Role??',
        body: "The use's role will be changed.",
        secondary: true,
        callback: confirm => this.handleRoleIdChanged(confirm, roleId, userId),
      },
    });
  };

  closeConfirmDialog() {
    this.setState({ showConfirmDialog: false, confirmDialogOptions: {}, clicked: false });
  }

  renderContent() {
    const roleOptions = Object.values(this.props.roles).map(role => (
      <option key={role.id} value={role.id}>
        {role.name.toUpperCase()}
      </option>
    ));

    const userList = _.orderBy(Object.values(this.props.users), ['fname', 'lname']).map(user => {
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

    return (
      <CardWrapper>
        <h4>User Management</h4>
        <Table size="sm" bordered>
          <thead className="thead-dark">
            <tr>
              <th>User</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>{userList}</tbody>
        </Table>
        {this.state.showConfirmDialog && (
          <DialogModal isOpen={this.state.showConfirmDialog} options={this.state.confirmDialogOptions} />
        )}
      </CardWrapper>
    );
  }

  render() {
    return (
      <React.Fragment>
        {utils.isCurrentUserAdmin() ? (
          <React.Fragment>
            <BreadcrumbFragment>{[{ active: true, text: 'Admin' }]}</BreadcrumbFragment>

            {this.renderContent()}
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
  { fetchUsers, editUserRole }
)(Admin);
