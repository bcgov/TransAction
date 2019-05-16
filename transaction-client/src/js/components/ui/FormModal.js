import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Form } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class FormModal extends React.Component {
  render() {
    const { title, isOpen, toggle, handleSubmit, onSubmit, submitting, pristine, children, onInit, size } = this.props;
    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} onOpened={onInit} size={size}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader toggle={toggle}>{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button size="sm" color="primary" type="submit" disabled={submitting || pristine}>
                {submitting ? <Spinner size="sm" /> : <FontAwesomeIcon icon="save" />} Save
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

FormModal.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  children: PropTypes.any.isRequired,
  onInit: PropTypes.func,
  size: PropTypes.string,
};

FormModal.defaultProps = {
  isOpen: false,
  submitting: false,
  size: '',
};

export default FormModal;
