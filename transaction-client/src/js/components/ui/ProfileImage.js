import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

// import * as Constants from '../../Constants';

class ProfileImage extends React.Component {
  handleChangeClicked = () => {};

  render() {
    const { src, alt, interactive } = this.props;

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

const mapStateToProps = state => {
  return {
    currentUser: state.users.current,
  };
};

export default connect(
  mapStateToProps,
  null
)(ProfileImage);
