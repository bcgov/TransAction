import React from 'react';

import AdminUser from './AdminUser';
import AdminActivity from './AdminActivity';
import BreadcrumbFragment from './fragments/BreadcrumbFragment';

import * as utils from '../utils';

const Admin = () => {
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
};

export default Admin;
