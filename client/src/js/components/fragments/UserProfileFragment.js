import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EditUserForm from '../forms/EditUserForm';
import ProfileImage from '../ui/ProfileImage';

import * as Constants from '../../Constants';

const UserProfileFragment = ({ regionName, canEdit, userToDisplay }) => {
  const [showEditUserForm, setShowEditUserForm] = useState(false);

  const showEditUserFormHandler = () => {
    setShowEditUserForm(true);
  };

  const toggleEditUserForm = () => {
    setShowEditUserForm((prevState) => !prevState);
  };

  const imageUrl =
    userToDisplay.images.length > 0
      ? `api/images/${userToDisplay.images[0].guid}`
      : `${process.env.PUBLIC_URL}/images/profile-placeholder.png`;

  return (
    <React.Fragment>
      <Row>
        <Col xs="12" md="auto">
          <ProfileImage
            src={imageUrl}
            alt="User Profile"
            interactive={canEdit}
            profileId={userToDisplay.id}
            type={Constants.PROFILE_TYPE.USER}
          />
        </Col>
        <Col>
          <span className="display-4">{`${userToDisplay.fname} ${userToDisplay.lname}`}</span>
          <span className="text-muted ml-2">from {regionName}</span>
          <p>{userToDisplay.description}</p>
        </Col>
        <Col xs="auto">
          {canEdit && (
            <Button color="primary" size="sm" onClick={showEditUserFormHandler}>
              <FontAwesomeIcon icon="edit" /> Edit
            </Button>
          )}
        </Col>
      </Row>
      {showEditUserForm && (
        <EditUserForm
          initialValues={userToDisplay}
          isOpen={showEditUserForm}
          toggle={toggleEditUserForm}
        />
      )}
    </React.Fragment>
  );
};

UserProfileFragment.propTypes = {
  userToDisplay: PropTypes.object.isRequired,
  regionName: PropTypes.string.isRequired,
};

export default UserProfileFragment;