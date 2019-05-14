import React from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col } from 'reactstrap';

import { rejectJoinRequest } from '../actions';
import TeamMemberRow from './ui/TeamMemberRow';

class TeamJoinRequestPanel extends React.Component {
  AcceptRequest = requestId => {};

  rejectRequest = request => {
    this.props.rejectJoinRequest(request.id, request).then(() => {});
  };

  render() {
    const { regions, teamToDisplay, users } = this.props;
    const joinRequests = Object.values(this.props.joinRequests).filter(request => {
      return request.teamId === teamToDisplay.id;
    });

    const teamMemberElements = joinRequests.map(joinRequest => {
      const user = users[joinRequest.userId];

      return (
        <TeamMemberRow key={user.id} user={user} regions={regions}>
          <React.Fragment>
            <Button color="success" size="sm" className="w75 mr-1">
              Accept
            </Button>
            <Button color="danger" size="sm" className="w75" onClick={() => this.rejectRequest(joinRequest)}>
              Reject
            </Button>
          </React.Fragment>
        </TeamMemberRow>
      );
    });

    return (
      <React.Fragment>
        <Row className="mb-2">
          <Col xs="6" lg="4">
            <strong>Name</strong>
          </Col>
          <Col xs="3" lg="4">
            <strong>Region</strong>
          </Col>
          <Col xs="3" lg="4" />
        </Row>
        {teamMemberElements}
        <hr />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    teams: Object.values(state.teams),
    users: state.users.all,
    regions: state.regions,
    currentUser: state.users.current,
    joinRequests: state.joinRequests,
  };
};

export default connect(
  mapStateToProps,
  { rejectJoinRequest }
)(TeamJoinRequestPanel);
