import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProfileFragment = ({ name, description, regionName, profileLink }) => {
  return (
    <React.Fragment>
      <Row>
        <Col>
          <div>
            <strong>Name</strong>
          </div>
          <div>
            {profileLink ? (
              <Link to={profileLink} className="no-underline">
                {name} <FontAwesomeIcon icon="external-link-alt" />
              </Link>
            ) : (
              name
            )}
          </div>
        </Col>
        <Col>
          <div>
            <strong>Region</strong>
          </div>
          <div>{regionName}</div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            <strong>Description</strong>
          </div>
          <div>{description}</div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

ProfileFragment.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  regionName: PropTypes.string.isRequired,
  profileLink: PropTypes.string,
};

export default ProfileFragment;
