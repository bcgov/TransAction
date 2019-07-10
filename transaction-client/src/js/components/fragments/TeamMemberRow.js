import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as Constants from '../../Constants';

const TeamMemberRow = ({ user, regions, children, teamLead }) => {
  return (
    <Row className="mb-1">
      <Col xs="6" lg="4">
        <Link to={`${Constants.PATHS.PROFILE}/${user.id}`} className="text-decoration-none">
          {`${user.fname} ${user.lname}`} {teamLead && <FontAwesomeIcon icon="star" />}{' '}
          <FontAwesomeIcon icon="external-link-alt" />
        </Link>
      </Col>
      <Col xs="3" lg="4">
        {regions[user.regionId].name}
      </Col>
      <Col xs="3" lg="4">
        {children}
      </Col>
    </Row>
  );
};

TeamMemberRow.propTypes = {
  user: PropTypes.object.isRequired,
  regions: PropTypes.object.isRequired,
  children: PropTypes.element,
};

export default TeamMemberRow;
