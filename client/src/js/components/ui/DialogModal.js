import React from 'react';
// import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';

class DialogModal extends React.Component {
  state = { clicked: false };

  init = () => {
    this.setState({ clicked: false });
  };

  handleOnClick = confirm => {
    this.setState({ clicked: true });

    this.props.options.callback(confirm);
  };

  render() {
    const { isOpen, options } = this.props;
    return (
      <div>
        <Modal isOpen={isOpen} toggle={this.closeDialog} onOpened={this.init}>
          <ModalHeader toggle={this.closeDialog}>{options.title}</ModalHeader>
          <ModalBody>{options.body}</ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              color="primary"
              disabled={this.state.clicked}
              onClick={() => this.handleOnClick(true)}
              style={{ minWidth: '50px' }}
            >
              {this.state.clicked && <Spinner size="sm" />} {options.primaryText ? options.primaryText : 'Yes'}
            </Button>
            {options.secondary && (
              <Button
                size="sm"
                color="secondary"
                onClick={() => this.handleOnClick(false)}
                disabled={this.state.clicked}
              >
                Cancel
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default DialogModal;
