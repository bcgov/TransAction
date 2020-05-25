import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, Row, Col } from 'reactstrap';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { leaveTeam, fetchUser, fetchCurrentUser } from '../../actions';
import TeamMemberRow from './TeamMemberRow';
import DialogModal from '../ui/DialogModal';

import * as Constants from '../../Constants';

class TeamMembersPanel extends React.Component {
  state = { clicked: false, showConfirmDialog: false, confirmDialogOptions: {} };

  handleRemoveUser = (confirm, user) => {
    if (confirm) {
      this.props
        .leaveTeam(user.teamId, user.id)
        .then(() => {
          if (user.id === this.props.currentUser.id) this.props.fetchCurrentUser();
          else this.props.fetchUser(user.id);
        })
        .finally(() => this.closeConfirmDialog());
    } else {
      this.closeConfirmDialog();
    }
  };

  confirmRemove = (self, user) => {
    let title = 'Leave Team?';
    let body =
      'This will remove yourself from the team.  If you are the leader, a random team member will be elected as the new leader.';

    if (!self) {
      title = 'Remove Member?';
      body = 'The team member will be removed from your team.';
    }

    this.setState({
      clicked: true,
      showConfirmDialog: true,
      confirmDialogOptions: {
        title,
        body,
        secondary: true,
        callback: confirm => this.handleRemoveUser(confirm, user),
      },
    });
  };

  closeConfirmDialog() {
    this.setState({ showConfirmDialog: false, confirmDialogOptions: {}, clicked: false });
  }

  render() {
    const { regions, currentUser, teamToDisplay } = this.props;
    const users = Object.values(_.pick(this.props.users, teamToDisplay.teamMemberIds));

    const teamMemberElements = _.orderBy(users, ['fname', 'lname']).map(user => {
      const teamLead = teamToDisplay.teamLeaderId === user.id;

      return (
        <TeamMemberRow key={user.id} user={user} regions={regions} teamLead={teamLead}>
          <React.Fragment>
            {teamToDisplay.numMembers > 1 &&
              (user.id === currentUser.id ? (
                <Button
                  color="danger"
                  size="sm"
                  className="team-remove"
                  onClick={() => this.confirmRemove(true, user)}
                  disabled={this.state.clicked}
                >
                  <FontAwesomeIcon icon="sign-out-alt" /> Leave
                </Button>
              ) : (
                currentUser.id === teamToDisplay.teamLeaderId && (
                  <Button
                    color="danger"
                    size="sm"
                    className="team-remove"
                    onClick={() => this.confirmRemove(false, user)}
                    disabled={this.state.clicked}
                  >
                    <FontAwesomeIcon icon="minus-square" /> Remove
                  </Button>
                )
              ))}
          </React.Fragment>
        </TeamMemberRow>
      );
    });

    return (
      <React.Fragment>
        {teamMemberElements.length < 5 && currentUser.teamId === teamToDisplay.id && (
          <Row>
            <Col>
              <Alert color="info">
                You can have up to 5 members on your team. You can recruit more members from the{' '}
                <Link to={Constants.PATHS.FREE_AGENTS}>Free Agents</Link>.
              </Alert>
            </Col>
          </Row>
        )}
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
        {this.state.showConfirmDialog && (
          <DialogModal isOpen={this.state.showConfirmDialog} options={this.state.confirmDialogOptions} />
        )}
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { leaveTeam, fetchUser, fetchCurrentUser }
)(TeamMembersPanel);
