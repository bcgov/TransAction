import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Popover, PopoverBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EditTeamForm from '../forms/EditTeamForm';
import ProfileImage from '../ui/ProfileImage';

import * as Constants from '../../Constants';

const TeamProfileFragment = ({
  team,
  regionName,
  canEdit,
  linkToProfile,
  currentUser,
}) => {
  const [showPointTip, setShowPointTip] = useState(false);
  const [showEditTeamForm, setShowEditTeamForm] = useState(false);

  const toggleEditTeamForm = () => {
    setShowEditTeamForm((prev) => !prev);
  };
  const imageUrl =
    team.images.length > 0
      ? `${Constants.API_URL}/images/${team.images[0].guid}`
      : `${process.env.PUBLIC_URL}/images/team-profile-placeholder.png`;

  return (
    <>
      <Row>
        <Col xs="12" md="auto">
          <ProfileImage
            src={imageUrl}
            alt="Team Profile"
            interactive={canEdit}
            profileId={team.id}
            type={Constants.PROFILE_TYPE.TEAM}
          />
        </Col>
        <Col>
          {linkToProfile ? (
            <Link
              className="display-4 text-decoration-none"
              to={`${Constants.PATHS.TEAM}/${team.id}`}
            >
              {team.name}
            </Link>
          ) : (
            <span className="display-4">{team.name}</span>
          )}
          <span className="text-muted ml-2">from {regionName}</span>
          <p>{team.description}</p>
          {team.id === currentUser.teamId && (
            <>
              <div>
                <strong>Team Goal:</strong> {`${team.goal} Points`}{' '}
                <FontAwesomeIcon
                  className="text-primary hover-pointer"
                  id="point-tip"
                  icon="question-circle"
                  onMouseOver={() => setShowPointTip(true)}
                  onMouseOut={() => setShowPointTip(false)}
                />
              </div>
              <Popover
                placement="top"
                isOpen={showPointTip}
                target="point-tip"
              >
                <PopoverBody>
                  The TransAction points goal set by your team leader. Points
                  are calculated using your team's workout intensity and
                  duration. One minute of work out equals one point, and then
                  multiplied by the workout intensity.
                </PopoverBody>
              </Popover>
            </>
          )}
        </Col>
        <Col xs="auto">
          {canEdit && (
            <Button color="primary" size="sm" onClick={() => setShowEditTeamForm(true)}>
              <FontAwesomeIcon icon="edit" /> Edit
            </Button>
          )}
        </Col>
      </Row>
      {showEditTeamForm && (
        <EditTeamForm
          initialValues={team}
          isOpen={showEditTeamForm}
          toggle={toggleEditTeamForm}
          formType={Constants.FORM_TYPE.EDIT}
        />
      )}
    </>
  );
};

TeamProfileFragment.propTypes = {
  team: PropTypes.object.isRequired,
  regionName: PropTypes.string.isRequired,
  canEdit: PropTypes.bool,
  linkToProfile: PropTypes.bool,
};

TeamProfileFragment.defaultProps = {
  canEdit: false,
  linkToProfile: false,
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.users.all[state.users.current.id],
  };
};

export default connect(mapStateToProps, null)(TeamProfileFragment);
