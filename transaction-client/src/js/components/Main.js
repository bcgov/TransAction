import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchRoles, fetchCurrentUser, updateCurrentUserRole, fetchRegions } from '../actions';
import DialogModal from './ui/DialogModal';

class Main extends Component {
  state = { loading: true };

  componentDidMount() {
    Promise.all([this.props.fetchRoles(), this.props.fetchCurrentUser(), this.props.fetchRegions()]).then(() => {
      this.props.updateCurrentUserRole(this.props.roles[this.props.currentUser.roleId].name);

      this.setState({ loading: false });
    });
  }

  render() {
    return this.state.loading ? (
      <div>Loading...</div>
    ) : (
      <React.Fragment>
        {this.props.children}
        <DialogModal />
      </React.Fragment>
    );
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
  { fetchRoles, fetchCurrentUser, updateCurrentUserRole, fetchRegions }
)(Main);
