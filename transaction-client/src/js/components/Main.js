import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchRoles, fetchCurrentUser, updateCurrentUserRole } from '../actions';
class Main extends Component {
  state = { loading: true };

  componentDidMount() {
    Promise.all([this.props.fetchRoles(), this.props.fetchCurrentUser()]).then(() => {
      this.props.updateCurrentUserRole(this.props.roles[this.props.currentUser.roleId].name);

      this.setState({ loading: false });
    });
  }
  render() {
    return this.state.loading ? <div>Loading...</div> : this.props.children;
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.current,
    roles: state.roles,
  };
};

export default connect(
  mapStateToProps,
  { fetchRoles, fetchCurrentUser, updateCurrentUserRole }
)(Main);
