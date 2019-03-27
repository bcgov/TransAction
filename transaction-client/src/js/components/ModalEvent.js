import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import RenderBody from './RenderBody';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { fetchEvents } from '../actions';

class ModalEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  componentDidMount() {
    this.props.fetchEvents();
  }

  render() {
    //console.log(this.props);
    return (
      <div>
        <Button color="primary" onClick={this.toggle} className={this.props.className}>
          {this.props.name}
        </Button>
        <Modal size="lg" centered={true} isOpen={this.state.modal} toggle={this.toggle} className={'center'}>
          <ModalHeader toggle={this.toggle}>{this.props.name}</ModalHeader>
          <ModalBody>
            <RenderBody modelClose={this.toggle}>{this.props}</RenderBody>
          </ModalBody>
          <ModalFooter />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { eventData: state.eventData };
};

export default connect(
  mapStateToProps,
  { fetchEvents }
)(ModalEvent);
