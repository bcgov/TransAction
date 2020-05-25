import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import ImageUploadModal from './ImageUploadModal';
import { fetchUser, fetchCurrentUser, fetchTeam } from '../../actions';
import * as api from '../../api/api';

import * as Constants from '../../Constants';

class ProfileImage extends React.Component {
  state = { showUploadImageModal: false };

  showUploadImageModal = () => {
    this.setState({ showUploadImageModal: true });
  };

  toggleUploadImageModal = () => {
    this.setState(prevState => ({
      showUploadImageModal: !prevState.showUploadImageModal,
    }));
  };

  handleUpload = async file => {
    const { type, profileId, currentUser, fetchUser, fetchCurrentUser, fetchTeam } = this.props;

    const formData = new FormData();
    formData.append('data', file);

    if (type === Constants.PROFILE_TYPE.USER) {
      formData.append('userId', profileId);
    } else if (type === Constants.PROFILE_TYPE.TEAM) {
      formData.append('teamId', profileId);
    }

    await api.instance.post('/images', formData);

    if (type === Constants.PROFILE_TYPE.USER) {
      if (currentUser.id === profileId) fetchCurrentUser();
      else fetchUser(profileId);
    } else if (type === Constants.PROFILE_TYPE.TEAM) {
      fetchTeam(profileId);
    }

    this.toggleUploadImageModal();
  };

  render() {
    const { src, alt, interactive } = this.props;

    const className = interactive ? 'interactive' : '';

    return (
      <React.Fragment>
        <div className={`profile-frame ${className}`} onMouseOver={this.handleOnMouseOver}>
          <img src={src} className="profile-frame-image" alt={alt} />
          {interactive && (
            <div className="profile-frame-overlay">
              <Button color="primary" onClick={this.showUploadImageModal}>
                Change
              </Button>
            </div>
          )}
        </div>
        {this.state.showUploadImageModal && (
          <ImageUploadModal
            isOpen={this.state.showUploadImageModal}
            toggle={this.toggleUploadImageModal}
            handleOnClick={this.handleUpload}
          />
        )}
      </React.Fragment>
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
    currentUser: state.users.all[state.users.current.id],
    users: state.users.all,
    teams: state.teams,
  };
};

export default connect(
  mapStateToProps,
  { fetchUser, fetchCurrentUser, fetchTeam }
)(ProfileImage);
