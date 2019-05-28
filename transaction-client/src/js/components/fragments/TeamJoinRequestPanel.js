import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { rejectJoinRequest, acceptJoinRequest, fetchUser, fetchSpecificTeamRequests } from '../../actions';
import TeamMemberRow from './TeamMemberRow';
// import PageSpinner from '../ui/PageSpinner';
import CardWrapper from '../ui/CardWrapper';
import OneClickButton from '../ui/OneClickButton';

class TeamJoinRequestPanel extends React.Component {
  state = { loading: true };

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
      })
      .catch(e => {
        console.error(e);
      });
  }

  acceptRequest = request => {
    this.props.acceptJoinRequest(request).then(() => {
      this.props.fetchUser(request.userId);
    });
  };

  rejectRequest = request => {
    this.props.rejectJoinRequest(request).then(() => {});
  };

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
              handleOnClick={() => this.acceptRequest(joinRequest)}
            >
              Accept
            </OneClickButton>
            <OneClickButton
              color="danger"
              size="sm"
              className="w75"
              handleOnClick={() => this.rejectRequest(joinRequest)}
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
    currentUser: state.users.current,
    joinRequests: Object.values(state.joinRequests).filter(request => {
      return request.teamId === ownProps.team.id;
    }),
  };
};

export default connect(
  mapStateToProps,
  { rejectJoinRequest, acceptJoinRequest, fetchUser, fetchSpecificTeamRequests }
)(TeamJoinRequestPanel);
