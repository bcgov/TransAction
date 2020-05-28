import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EditUserForm from '../forms/EditUserForm';
import ProfileImage from '../ui/ProfileImage';

import * as Constants from '../../Constants';

class UserProfileFragment extends React.Component {
  state = { showPointTip: false, showEditUserForm: false };

  showEditUserForm = () => {
    this.setState({ showEditUserForm: true });
  };

  toggleEditUserForm = () => {
    this.setState((prevState) => ({
      showEditUserForm: !prevState.showEditUserForm,
    }));
  };

  render() {
    const { regionName, canEdit, userToDisplay } = this.props;

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
              <Button color="primary" size="sm" onClick={this.showEditUserForm}>
                <FontAwesomeIcon icon="edit" /> Edit
              </Button>
            )}
          </Col>
        </Row>
        {this.state.showEditUserForm && (
          <EditUserForm
            initialValues={userToDisplay}
            isOpen={this.state.showEditUserForm}
            toggle={this.toggleEditUserForm}
          />
        )}
      </React.Fragment>
    );
  }
}

UserProfileFragment.propTypes = {
  userToDisplay: PropTypes.object.isRequired,
  regionName: PropTypes.string.isRequired,
};

export default UserProfileFragment;
