import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import RenderBody from './RenderBody';

class ModalEvent extends React.Component {
  render() {
    // console.log(this.props);
    return (
      <div>
        <Modal size="lg" centered={true} isOpen={this.props.isOpen} toggle={this.props.toggle} className={'center'}>
          <ModalHeader toggle={this.props.toggle}>{this.props.name}</ModalHeader>
          <ModalBody>
            <RenderBody modalClose={this.props.toggle}>{this.props}</RenderBody>
          </ModalBody>
          <ModalFooter />
        </Modal>
      </div>
    );
  }
}

export default ModalEvent;
