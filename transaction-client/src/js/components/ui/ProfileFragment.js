import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ProfileFragment extends React.Component {
  state = { showPointTip: false };

  togglePointTip = param => {
    this.setState({ showPointTip: param });
  };

  render() {
    const { name, description, regionName, profileLink, goal } = this.props;

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
                  {name}{' '}
                  <Button color="link">
                    <FontAwesomeIcon icon="external-link-alt" />
                  </Button>
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
          {goal && (
            <Col>
              <div>
                <strong>Goal</strong>
              </div>
              <div>
                {`${goal} Points`}{' '}
                <FontAwesomeIcon
                  className="text-primary hover-pointer"
                  id="point-tip"
                  icon="question-circle"
                  onMouseOver={() => this.togglePointTip(true)}
                  onMouseOut={() => this.togglePointTip(false)}
                />
              </div>
              <Popover placement="top" isOpen={this.state.showPointTip} target="point-tip">
                <PopoverHeader>What is this?</PopoverHeader>
                <PopoverBody>
                  The TransAction points goal set by your team leader. Points are calculated using your team's workout
                  intensity and duration.
                </PopoverBody>
              </Popover>
            </Col>
          )}
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
  }
}

ProfileFragment.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  regionName: PropTypes.string.isRequired,
  profileLink: PropTypes.string,
};

export default ProfileFragment;
