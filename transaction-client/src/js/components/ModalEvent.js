import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import RenderBody from './RenderBody';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { fetchData } from '../actions';

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
    this.props.fetchData();
  }

  render() {
    //console.log(this.props.eventData);
    return (
      <div>
        <Button color="primary" onClick={this.toggle} className={this.props.className}>
          {this.props.name}
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={'center'}>
          <ModalHeader toggle={this.toggle}>{this.props.name} Event</ModalHeader>
          <ModalBody>
            <RenderBody>{this.props}</RenderBody>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>
              Do a thing!
            </Button>
            <Button color="secondary" onClick={this.toggle}>
              Nooooooo
            </Button>
          </ModalFooter>
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
  { fetchData }
)(ModalEvent);
