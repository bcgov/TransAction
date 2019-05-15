import React from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col } from 'reactstrap';
import _ from 'lodash';

import { leaveTeam, fetchUser, fetchCurrentUser } from '../../actions';
import TeamMemberRow from './TeamMemberRow';

class TeamMembersPanel extends React.Component {
  handleRemoveUser = user => {
    this.props.leaveTeam(user.teamId, user.id).then(() => {
      if (user.id === this.props.currentUser.id) this.props.fetchCurrentUser();
      else this.props.fetchUser(user.id);
    });
  };

  render() {
    const { regions, currentUser, teamToDisplay } = this.props;
    const users = Object.values(_.pick(this.props.users, teamToDisplay.teamMemberIds));

    const teamMemberElements = users.map(user => {
      return (
        <TeamMemberRow key={user.id} user={user} regions={regions}>
          <React.Fragment>
            {teamToDisplay.numMembers > 1 &&
              (user.id === currentUser.id ? (
                <Button color="danger" size="sm" className="w75" onClick={() => this.handleRemoveUser(user)}>
                  Leave
                </Button>
              ) : (
                currentUser.id === teamToDisplay.teamLeaderId && (
                  <Button color="danger" size="sm" className="w75" onClick={() => this.handleRemoveUser(user)}>
                    Remove
                  </Button>
                )
              ))}
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

export default connect(
  null,
  { leaveTeam, fetchUser, fetchCurrentUser }
)(TeamMembersPanel);
