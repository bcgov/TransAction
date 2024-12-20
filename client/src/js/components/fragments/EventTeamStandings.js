import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Progress, Table } from 'reactstrap';

import { fetchTeamStandings, fetchTeams } from '../../actions';
import PageSpinner from '../ui/PageSpinner';

const EventTeamStandings = ({ eventId, teamStandings, teams, fetchTeamStandings, fetchTeams }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await Promise.all([
        fetchTeamStandings(eventId, 200),
        fetchTeams('', 0, 2147483647),
      ]);

      setLoading(false);
    };

    fetchData();
  }, [eventId, fetchTeamStandings, fetchTeams]);

  const renderContent = () => {
    const standings = teamStandings[eventId] || [];

    if (standings.length === 0) {
      return <div>No standings</div>;
    }

    const topScore = standings[0].score;

    const teamStandingRows = standings.map((standing, index) => {
      const { teamId, score } = standing;

      return (
        <tr key={teamId}>
          <th scope="row" style={{ whiteSpace: 'nowrap', width: '1%' }}>
            {`#${index + 1}`}
          </th>
          <th scope="row" style={{ whiteSpace: 'nowrap', width: '1%' }}>
            {teams[teamId]?.name || 'Unknown Team'}
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
  };

  return loading ? (
    <PageSpinner />
  ) : (
    <>
      <h5>Team Standings</h5>
      {renderContent()}
    </>
  );
};

const mapStateToProps = (state) => ({
  teamStandings: state.scores.teamStandings,
  teams: state.teams,
});

export default connect(mapStateToProps, { fetchTeamStandings, fetchTeams })(EventTeamStandings);
