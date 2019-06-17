import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchRoles, fetchCurrentUser, fetchRegions } from '../actions';
import PageSpinner from './ui/PageSpinner';

class Main extends Component {
  state = { loading: true };

  componentDidMount() {
    Promise.all([this.props.fetchRoles(), this.props.fetchCurrentUser(), this.props.fetchRegions()]).then(() => {
      this.setState({ loading: false });
    });

    // this.props.fetchRoles();
  }

  render() {
    return this.state.loading ? <PageSpinner /> : <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.all[state.users.current.id],
    roles: state.roles,
  };
};

export default connect(
  mapStateToProps,
  { fetchRoles, fetchCurrentUser, fetchRegions }
)(Main);
