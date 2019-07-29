import React from 'react';
import { connect } from 'react-redux';
import { Progress, Table } from 'reactstrap';

import { fetchTeamStandings, fetchTeams } from '../../actions';
import PageSpinner from '../ui/PageSpinner';

class EventTeamStandings extends React.Component {
  state = { loading: true };

  componentDidMount() {
    this.setState({ loading: true });

    Promise.all([this.props.fetchTeamStandings(this.props.eventId), this.props.fetchTeams()]).then(() => {
      this.setState({ loading: false });
    });
  }

  renderContent() {
    const { teams } = this.props;
    const teamStandings = this.props.teamStandings[this.props.eventId];

    if (teamStandings.length === 0) return <div>No standings</div>;

    const topScore = teamStandings[0].score;

    const teamStandingRows = teamStandings.map((standing, index) => {
      const { teamId, score } = standing;
      return (
        <tr key={teamId}>
          <th scope="row" style={{ whiteSpace: 'nowrap', width: '1%' }}>
            {`#${index + 1}`}
          </th>
          <th scope="row" style={{ whiteSpace: 'nowrap', width: '1%' }}>
            {teams[teamId].name}
          </th>
          <td>
            <Progress value={(score / topScore) * 100}>{score}</Progress>
          </td>
        </tr>
      );
    });

    return (
      <Table borderless>
        <tbody>{teamStandingRows}</tbody>
      </Table>
    );
  }

  render() {
    return this.state.loading ? (
      <PageSpinner />
    ) : (
      <React.Fragment>
        <h5>Team Standings</h5> {this.renderContent()}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    teamStandings: state.scores.teamStandings,
    teams: state.teams,
  };
};

export default connect(
  mapStateToProps,
  { fetchTeamStandings, fetchTeams }
)(EventTeamStandings);
