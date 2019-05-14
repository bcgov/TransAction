import React from 'react';
import { Button, Row, Col } from 'reactstrap';

import TeamMemberRow from './ui/TeamMemberRow';

class TeamMembersPanel extends React.Component {
  render() {
    const users = Object.values(this.props.users);
    const { regions, currentUser, teamToDisplay } = this.props;

    const teamMemberElements = users
      .filter(user => {
        return user.teamId === teamToDisplay.id;
      })
      .map(user => {
        return (
          <TeamMemberRow key={user.id} user={user} regions={regions}>
            <React.Fragment>
              {user.id === currentUser.id ? (
                <Button color="danger" size="sm" className="w75">
                  Leave
                </Button>
              ) : (
                currentUser.id === teamToDisplay.teamLeaderId && (
                  <Button color="danger" size="sm" className="w75">
                    Remove
                  </Button>
                )
              )}
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

export default TeamMembersPanel;
