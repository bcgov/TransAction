import React from 'react';
import { connect } from 'react-redux';
import { BreadcrumbItem, Input, Table } from 'reactstrap';
import _ from 'lodash';

import CardWrapper from './ui/CardWrapper';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';
import { fetchUsers, editUserRole } from '../actions';

import * as utils from '../utils';
// import * as Constants from '../Constants';

class Admin extends React.Component {
  state = { toggleActive: {} };

  componentDidMount() {
    this.props.fetchUsers();
  }

  handleRoleIdChanged = (roleId, userId) => {
    this.props.editUserRole({ roleId, userId });
  };

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
              onChange={e => this.handleRoleIdChanged(e.target.value, user.id)}
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
      </CardWrapper>
    );
  }

  render() {
    return (
      <React.Fragment>
        {utils.isCurrentUserAdmin() ? (
          <React.Fragment>
            <BreadcrumbFragment>
              <BreadcrumbItem active>Admin</BreadcrumbItem>
            </BreadcrumbFragment>
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
    currentUser: state.users.current,
    users: state.users.all,
    roles: state.roles,
  };
};

export default connect(
  mapStateToProps,
  { fetchUsers, editUserRole }
)(Admin);
