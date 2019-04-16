import React, { Component } from 'react';
import { fetchUser, fetchEvent } from '../actions';
import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem, Container, Spinner, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

class EventPage extends Component {
  state = { loading: true, modal: false };
  toggleSpinner = () => {
    this.setState(prevState => ({
      loading: !prevState.loading,
    }));
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  componentDidMount() {
    // this.toggleSpinner();
    Promise.all([this.props.fetchUser('me'), this.props.fetchEvent(this.props.paramId)])
      .then(() => {
        this.toggleSpinner();
      })
      .catch(() => {
        this.toggleSpinner();
      });
  }

  checkTeam() {
    if (this.props.user.teamid === null) {
      return (
        <React.Fragment>
          <h5> What is {this.props.event.name}?</h5>
          <div className="event_description mt-2 mb-2">{this.props.event.description}</div>
          <div id="centerText">
            <Link to="/getting_started" id={this.props.event.id} name={this.props.event.name}>
              <Button size="lg" color="primary">
                Get Started!
              </Button>
            </Link>
          </div>
        </React.Fragment>
      );
    }
    //TODO add else with graphical elements
  }

  renderPage() {
    return (
      <React.Fragment>
        <h1>{this.props.event.name} </h1>
        <Button className="float-right" color="primary">
          Add Activity
        </Button>
        <h3>Hi {this.props.user.name}!</h3>
        {this.checkTeam()}
      </React.Fragment>
    );
  }

  decideRender() {
    if (this.state.loading) {
      //console.log('spin');
      return (
        <div className="col-1 offset-6">
          <Spinner color="primary" style={{ width: '5rem', height: '5rem' }} />
        </div>
      );
    }
    //Loading DONE
    else {
      return <div>{this.renderPage()}</div>;
    }
  }

  render() {
    return (
      <Container>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Event</BreadcrumbItem>
        </Breadcrumb>
        {this.decideRender()}
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    paramId: parseInt(ownProps.match.params.id),
    event: state.events[parseInt(ownProps.match.params.id)],
  };
};

export default connect(
  mapStateToProps,
  { fetchUser, fetchEvent }
)(EventPage);
