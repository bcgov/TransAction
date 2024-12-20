import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Progress, Table } from 'reactstrap';
import _ from 'lodash';

import { fetchRegionStandings } from '../../actions';
import PageSpinner from '../ui/PageSpinner';

const EventRegionStandings = ({ eventId, regions, regionStandings, fetchRegionStandings }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchRegionStandings(eventId);
      setLoading(false);
    };

    fetchData();
  }, [eventId, fetchRegionStandings]);

  const renderContent = () => {
    const regionStanding = regionStandings[eventId];
    const maxScore = _.maxBy(Object.values(regionStanding), (o) => o.score)?.score || 1;

    const regionStandingRows = regions.map((region, index) => {
      const score = regionStanding[region.id]?.score || 0;

      return (
        <tr key={region.id}>
          <th scope="row" style={{ whiteSpace: 'nowrap', width: '1%' }}>
            {`#${index + 1}`}
          </th>
          <th scope="row" style={{ whiteSpace: 'nowrap', width: '1%' }}>
            {region.name}
          </th>
          <td>
            <Progress value={(score / maxScore) * 100} color="danger">
              {score}
            </Progress>
          </td>
        </tr>
      );
    });

    return (
      <Table borderless>
        <tbody>{regionStandingRows}</tbody>
      </Table>
    );
  };

  return loading ? (
    <PageSpinner />
  ) : (
    <>
      <h5>Region Standings</h5>
      {renderContent()}
    </>
  );
};

const mapStateToProps = (state) => ({
  regionStandings: state.scores.regionStandings,
  regions: Object.values(state.regions),
});

export default connect(mapStateToProps, { fetchRegionStandings })(EventRegionStandings);
