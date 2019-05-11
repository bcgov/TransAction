import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Form } from 'reactstrap';

class FormModal extends React.Component {
  render() {
    const { title, isOpen, toggle, handleSubmit, onSubmit, submitting, pristine, children, onInit } = this.props;
    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} onOpened={onInit}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader toggle={toggle}>{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button size="sm" color="primary" type="submit" disabled={submitting || pristine}>
                {submitting && <Spinner size="sm" />} Submit
              </Button>
              <Button size="sm" color="secondary" onClick={toggle} disabled={submitting}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default FormModal;
