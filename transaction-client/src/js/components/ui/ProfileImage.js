import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import * as Constants from '../../Constants';

class ProfileImage extends React.Component {
  handleChangeClicked = () => {};

  render() {
    const { src, alt, type, profileId, currentUser, interactive } = this.props;

    const className = interactive ? 'interactive' : '';

    return (
      <div className={`profile-frame ${className}`} onMouseOver={this.handleOnMouseOver}>
        <img src={src} width="200" height="200" alt={alt} style={{ objectFit: 'cover' }} />
        {interactive && (
          <div className="profile-frame-overlay">
            <Button color="primary" onClick={this.handleChangeClicked}>
              Change
            </Button>
          </div>
        )}
      </div>
    );
  }
}

ProfileImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  interactive: PropTypes.bool,
  profileId: PropTypes.number,
};

ProfileImage.defaultProps = {
  interactive: false,
};

const mapStateToProps = state => {
  return {
    currentUser: state.users.current,
  };
};

export default connect(
  mapStateToProps,
  null
)(ProfileImage);
