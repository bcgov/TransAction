import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Popover, PopoverBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as Constants from '../../Constants';

class TeamProfileFragment extends React.Component {
  state = { showPointTip: false };

  togglePointTip = param => {
    this.setState({ showPointTip: param });
  };

  render() {
    const { team, regionName, canEdit, linkToProfile, currentUser } = this.props;

    return (
      <React.Fragment>
        <Row>
          <Col xs="12" md="auto">
            <img
              className="profile-frame"
              src="/images/team-profile-placeholder.png"
              width="200"
              height="200"
              alt="Team Profile"
            />
          </Col>
          <Col>
            {linkToProfile ? (
              <Link className="display-4 no-underline" to={`${Constants.PATHS.TEAM}/${team.id}`}>
                {team.name}
              </Link>
            ) : (
              <span className="display-4">{team.name}</span>
            )}
            <span className="text-muted ml-2">from {regionName}</span>
            <p>{team.description}</p>
            {team.id === currentUser.teamId && (
              <React.Fragment>
                <div>
                  <strong>Team Goal:</strong> {`${team.goal} Points`}{' '}
                  <FontAwesomeIcon
                    className="text-primary hover-pointer"
                    id="point-tip"
                    icon="question-circle"
                    onMouseOver={() => this.togglePointTip(true)}
                    onMouseOut={() => this.togglePointTip(false)}
                  />
                </div>
                <Popover placement="top" isOpen={this.state.showPointTip} target="point-tip">
                  <PopoverBody>
                    The TransAction points goal set by your team leader. Points are calculated using your team's workout
                    intensity and duration. One minute of work out equals one point, and then multiplied by the workout
                    intensity.
                  </PopoverBody>
                </Popover>
              </React.Fragment>
            )}
          </Col>
          <Col xs="auto">
            {canEdit && (
              <Button color="primary" size="sm" onClick={this.showEditUserForm}>
                <FontAwesomeIcon icon="edit" /> Edit
              </Button>
            )}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

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

const mapStateToProps = state => {
  return {
    currentUser: state.users.current,
  };
};

export default connect(
  mapStateToProps,
  null
)(TeamProfileFragment);
