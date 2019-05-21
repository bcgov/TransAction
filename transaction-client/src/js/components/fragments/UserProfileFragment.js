import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class UserProfileFragment extends React.Component {
  state = { showPointTip: false };

  togglePointTip = param => {
    this.setState({ showPointTip: param });
  };

  render() {
    const { name, description, regionName, profileLink } = this.props;

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

UserProfileFragment.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  regionName: PropTypes.string.isRequired,
  profileLink: PropTypes.string,
};

export default UserProfileFragment;
