import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { fetchRoles, fetchCurrentUser, fetchRole, updateAuthUser } from '../actions';
class Main extends Component {
  state = { loading: true };

  componentDidMount() {
    Promise.all([this.props.fetchRoles(), this.props.fetchCurrentUser()]).then(() => {
      const currentUser = this.props.currentUser;
      this.props.updateAuthUser({
        db_role_id: currentUser.roleId,
        db_user_id: currentUser.id,
        role_name: this.props.roles[currentUser.roleId].name.toLowerCase(),
      });

      this.setState({ loading: false });
    });
  }
  render() {
    return <Container>{this.state.loading ? <div>Loading...</div> : this.props.children}</Container>;
  }
}

const mapStateToProps = state => {
  return {
    authUser: state.authUser,
    currentUser: state.currentUser,
    roles: state.roles,
  };
};

export default connect(
  mapStateToProps,
  { fetchRoles, fetchCurrentUser, fetchRole, updateAuthUser }
)(Main);
