import React from 'react';

import AdminUser from './AdminUser';
import AdminActivity from './AdminActivity';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as api from '../api/api';
import * as utils from '../utils';

class Admin extends React.Component {
  componentDidMount() {
    api.resetCancelTokenSource();
  }

  componentWillUnmount() {
    api.cancelRequest();
  }

  render() {
    return (
      <React.Fragment>
        {utils.isCurrentUserAdmin() ? (
          <React.Fragment>
            <BreadcrumbFragment>{[{ active: true, text: 'Admin' }]}</BreadcrumbFragment>

            <AdminUser />
            <AdminActivity />
          </React.Fragment>
        ) : (
          <p>Hey you shouldn't be here...</p>
        )}
      </React.Fragment>
    );
  }
}

export default Admin;
