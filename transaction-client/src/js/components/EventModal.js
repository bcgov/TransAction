import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class EventModal extends React.Component {
  render() {
    // console.log(this.props);
    return (
      <Modal size="lg" centered={true} isOpen={this.props.isOpen} toggle={this.props.toggle} className={'center'}>
        <ModalHeader toggle={this.props.toggle}>{this.props.text}</ModalHeader>
        <ModalBody>{this.props.children}</ModalBody>
        <ModalFooter />
      </Modal>
    );
  }
}

export default EventModal;
