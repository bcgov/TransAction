import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { rejectJoinRequest, addUserToTeam, fetchUser, fetchSpecificTeamRequests } from '../../actions';
import TeamMemberRow from './TeamMemberRow';
import CardWrapper from '../ui/CardWrapper';
import OneClickButton from '../ui/OneClickButton';
import DialogModal from '../ui/DialogModal';

class TeamJoinRequestPanel extends React.Component {
  state = { loading: true, showConfirmDialog: false, confirmDialogOptions: {} };

  componentDidMount() {
    this.setState({ loading: true });

    const { team, fetchSpecificTeamRequests } = this.props;
    fetchSpecificTeamRequests(team.id)
      .then(() => {
        const usersToFetch = this.props.joinRequests.map(request => {
          return request.userId;
        });

        return Promise.all(
          usersToFetch.map(user => {
            return this.props.fetchUser(user);
          })
        );
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  acceptRequest = (confirm, request) => {
    if (confirm) {
      this.props
        .addUserToTeam(request)
        .then(() => {
          return this.props.fetchUser(request.userId);
        })
        .then(() => {
          this.closeConfirmDialog();
        });
    }
  };

  rejectRequest = (confirm, request) => {
    if (confirm) {
      this.props.rejectJoinRequest(request).then(() => {
        this.closeConfirmDialog();
      });
    } else {
      this.closeConfirmDialog();
    }
  };

  confirmAcceptRequest = request => {
    this.setState({
      showConfirmDialog: true,
      confirmDialogOptions: {
        title: 'Accept Request?',
        body: 'The user will become part of your team.',
        secondary: true,
        callback: confirm => this.acceptRequest(confirm, request),
      },
    });
  };

  confirmRejectRequest = request => {
    this.setState({
      showConfirmDialog: true,
      confirmDialogOptions: {
        title: 'Reject Request?',
        body: 'The user will not become part of your team.',
        secondary: true,
        callback: confirm => this.rejectRequest(confirm, request),
      },
    });
  };

  closeConfirmDialog() {
    this.setState({ showConfirmDialog: false, confirmDialogOptions: {} });
  }

  renderContent() {
    const { regions, team, users, joinRequests } = this.props;

    const teamMemberElements = joinRequests.map(joinRequest => {
      const user = users[joinRequest.userId];

      return (
        <TeamMemberRow key={user.id} user={user} regions={regions}>
          <React.Fragment>
            <OneClickButton
              color="success"
              size="sm"
              className="w75 mr-1"
              handleOnClick={() => this.confirmAcceptRequest(joinRequest)}
            >
              Accept
            </OneClickButton>
            <OneClickButton
              color="danger"
              size="sm"
              className="w75"
              handleOnClick={() => this.confirmRejectRequest(joinRequest)}
            >
              Reject
            </OneClickButton>
          </React.Fragment>
        </TeamMemberRow>
      );
    });

    return (
      joinRequests.length > 0 &&
      team.numMembers < 5 && (
        <CardWrapper>
          <Row className="mb-3">
            <Col>
              <h4>Team Join Requests</h4>
            </Col>
          </Row>
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
        </CardWrapper>
      )
    );
  }

  render() {
    return !this.state.loading && this.renderContent();
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users.all,
    regions: state.regions,
    currentUser: state.users.all[state.users.current.id],
    joinRequests: Object.values(state.joinRequests).filter(request => {
      return request.teamId === ownProps.team.id;
    }),
  };
};

export default connect(
  mapStateToProps,
  { rejectJoinRequest, addUserToTeam, fetchUser, fetchSpecificTeamRequests }
)(TeamJoinRequestPanel);
