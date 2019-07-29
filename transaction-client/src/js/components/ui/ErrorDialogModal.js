import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { hideErrorDialog } from '../../actions';

class ErrorDialogModal extends React.Component {
  state = { clicked: false };

  init = () => {
    this.setState({ clicked: false });
  };

  handleOnClick = reload => {
    this.setState({ clicked: true });

    if (reload) window.location.reload();
    else this.props.hideErrorDialog();
  };

  render() {
    const { isOpen, message, statusCode, path, method } = this.props;
    return (
      <div>
        <Modal isOpen={isOpen} toggle={this.closeDialog} onOpened={this.init}>
          <ModalHeader toggle={this.closeDialog}>Server Error</ModalHeader>
          <ModalBody>
            <p>
              A <strong>{method}</strong> request to <strong className="text-primary">{path}</strong> has returned a{' '}
              <strong className="text-danger">{statusCode}</strong> status code.
            </p>
            <p>
              <small>
                <strong>Additional Information:</strong> {message}
              </small>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              color="primary"
              disabled={this.state.clicked}
              onClick={() => this.handleOnClick(true)}
              style={{ minWidth: '50px' }}
            >
              Reload
            </Button>
            <Button size="sm" color="secondary" onClick={() => this.handleOnClick(false)} disabled={this.state.clicked}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(
  null,
  { hideErrorDialog }
)(ErrorDialogModal);
