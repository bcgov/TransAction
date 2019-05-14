import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';

import { hideGlobalModal } from '../../actions';

class DialogModal extends React.Component {
  state = { clicked: false };

  init = () => {
    this.setState({ clicked: false });
  };

  handleOnClick = () => {
    this.setState({ clicked: true });
    const callback = this.props.callback;

    if (callback) {
      callback().then(() => {
        this.closeDialog();
      });
    }
  };

  closeDialog = () => {
    this.props.hideGlobalModal();
  };

  render() {
    const { isOpen, title, body, secondary } = this.props.dialogOptions;
    return (
      <div>
        <Modal isOpen={isOpen} toggle={this.closeDialog} onOpened={this.init}>
          <ModalHeader toggle={this.closeDialog}>{title}</ModalHeader>
          <ModalBody>{body}</ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              color="primary"
              disabled={this.state.clicked}
              onClick={this.handleOnClick}
              style={{ minWidth: '50px' }}
            >
              {this.state.clicked && <Spinner size="sm" />} Yes
            </Button>
            {secondary && (
              <Button size="sm" color="secondary" onClick={this.closeDialog} disabled={this.state.clicked}>
                Cancel
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    dialogOptions: state.dialogModal,
  };
};

export default connect(
  mapStateToProps,
  { hideGlobalModal }
)(DialogModal);
