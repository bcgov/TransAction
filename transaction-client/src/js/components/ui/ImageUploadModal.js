import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropzone from 'react-dropzone';

class ImageUploadModal extends React.Component {
  state = { files: [], submitting: false };

  componentWillUnmount() {
    this.state.files.forEach(file => URL.revokeObjectURL(file.preview));
  }

  handleOnDrop = files => {
    this.setState({
      files: files.slice(0, 1).map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    });
  };

  handleOnClick = () => {
    this.setState({ submitting: true });

    if (this.state.files.length > 0) {
      this.props.handleOnClick(this.state.files[0]);
    }
  };

  render() {
    const files = this.state.files.map(file => (
      <div className="dropzone-preview-frame" key={file.name}>
        <img src={file.preview} alt={file.name} className="dropzone-preview" />
      </div>
    ));

    const { isOpen, toggle } = this.props;

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalHeader toggle={toggle}>Upload Image</ModalHeader>
          <ModalBody>
            <Dropzone onDrop={this.handleOnDrop} multiple={false} accept={['image/png', 'image/jpeg']}>
              {({ getRootProps, getInputProps, isDragAccept, isDragActive, isDragReject }) => {
                let status = '';

                if (isDragAccept) {
                  status = 'accept';
                } else if (isDragReject) {
                  status = 'reject';
                } else if (isDragActive) {
                  status = 'active';
                }

                return (
                  <React.Fragment>
                    <section className={`dropzone-container ${status}`}>
                      <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <p>Drag pictures here or click to select them</p>
                        <div>
                          <small>Square images will look the best in your profile</small>
                        </div>
                        <div>
                          <small>Supported formats: JPEG and PNG</small>
                        </div>
                      </div>
                    </section>
                    {files.length > 0 && <div className="text-center my-3">{files}</div>}
                  </React.Fragment>
                );
              }}
            </Dropzone>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" color="primary" onClick={this.handleOnClick} disabled={this.state.files.length === 0}>
              {this.state.submitting ? <Spinner size="sm" /> : <FontAwesomeIcon icon="upload" />} Upload
            </Button>
            <Button size="sm" color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(
  null,
  null
)(ImageUploadModal);
