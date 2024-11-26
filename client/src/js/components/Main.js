import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchRoles, fetchCurrentUser, fetchRegions, fetchVersion } from '../actions';
import PageSpinner from './ui/PageSpinner';
import ErrorDialogModal from './ui/ErrorDialogModal';

const Main = ({ fetchRoles, fetchCurrentUser, fetchRegions, fetchVersion, errorDialog, children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchRoles(),
        fetchCurrentUser(),
        fetchRegions(),
        fetchVersion(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [fetchRoles, fetchCurrentUser, fetchRegions, fetchVersion]);

  return (
    <>
      {loading ? <PageSpinner /> : children}
      {errorDialog.show && <ErrorDialogModal isOpen={errorDialog.show} {...errorDialog} />}
    </>
  );
};

const mapStateToProps = state => ({
  currentUser: state.users.all[state.users.current.id],
  roles: state.roles,
  errorDialog: state.errorDialog,
});

export default connect(mapStateToProps, { fetchRoles, fetchCurrentUser, fetchRegions, fetchVersion })(Main);
