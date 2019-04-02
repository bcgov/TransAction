import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import EventModalBody from './EventModalBody';

class EventModal extends React.Component {
  render() {
    // console.log(this.props);
    return (
      <div>
        <Modal size="lg" centered={true} isOpen={this.props.isOpen} toggle={this.props.toggle} className={'center'}>
          <ModalHeader toggle={this.props.toggle}>{this.props.text}</ModalHeader>
          <ModalBody>
            <EventModalBody modalClose={this.props.toggle}>{this.props}</EventModalBody>
          </ModalBody>
          <ModalFooter />
        </Modal>
      </div>
    );
  }
}

export default EventModal;
