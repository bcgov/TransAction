import React from 'react';
import { connect } from 'react-redux';
import { Progress, Table } from 'reactstrap';
import _ from 'lodash';

import { fetchRegionStandings } from '../../actions';
import PageSpinner from '../ui/PageSpinner';

class EventRegionStandings extends React.Component {
  state = { loading: true };

  componentDidMount() {
    this.setState({ loading: true });

    this.props.fetchRegionStandings(this.props.eventId).then(() => {
      this.setState({ loading: false });
    });
  }

  renderContent() {
    const { regions, regionStandings, eventId } = this.props;
    const regionStanding = regionStandings[eventId];
    const maxScore = _.maxBy(Object.values(regionStanding), o => {
      return o.score;
    }).score;

    const regionStandingRows = regions.map((region, index) => {
      const score = regionStanding[region.id] ? regionStanding[region.id].score : 0;

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
  }

  render() {
    return this.state.loading ? (
      <PageSpinner />
    ) : (
      <React.Fragment>
        <h5>Region Standings</h5> {this.renderContent()}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    regionStandings: state.scores.regionStandings,
    regions: Object.values(state.regions),
  };
};

export default connect(
  mapStateToProps,
  { fetchRegionStandings }
)(EventRegionStandings);
