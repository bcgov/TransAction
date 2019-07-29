import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchRoles, fetchCurrentUser, fetchRegions } from '../actions';
import PageSpinner from './ui/PageSpinner';
import ErrorDialogModal from './ui/ErrorDialogModal';

class Main extends Component {
  state = { loading: true, showErrorDialog: false, errorDialogOptions: {} };

  componentDidMount() {
    Promise.all([this.props.fetchRoles(), this.props.fetchCurrentUser(), this.props.fetchRegions()]).then(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { errorDialog } = this.props;
    const errorDialogOptions = {
      message: errorDialog.message,
      primaryText: 'Reload',
    };

    return this.state.loading ? (
      <PageSpinner />
    ) : (
      <React.Fragment>
        {this.props.children}
        {errorDialog.show && <ErrorDialogModal isOpen={errorDialog.show} options={errorDialogOptions} />}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.all[state.users.current.id],
    roles: state.roles,
    errorDialog: state.errorDialog,
  };
};

export default connect(
  mapStateToProps,
  { fetchRoles, fetchCurrentUser, fetchRegions }
)(Main);
